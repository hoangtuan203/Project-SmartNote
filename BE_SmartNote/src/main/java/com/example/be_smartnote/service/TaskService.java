package com.example.be_smartnote.service;

import com.example.be_smartnote.dto.request.TaskRequest;
import com.example.be_smartnote.dto.response.*;
import com.example.be_smartnote.entities.Task;
import com.example.be_smartnote.entities.User;
import com.example.be_smartnote.exception.AppException;
import com.example.be_smartnote.exception.ErrorCode;
import com.example.be_smartnote.mapper.TaskMapper;
import com.example.be_smartnote.repository.TaskRepository;
import com.example.be_smartnote.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@Transactional
public class TaskService {
    private final TaskMapper taskMapper;
    private final TaskRepository taskRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, TaskMapper taskMapper, NotificationService notificationService,
                       UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.taskMapper = taskMapper;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    //get all and pagination
    public TaskResponseWrapper getAllTaskPageable(Pageable pageable, Long userId) {
        Page<Task> tasks = taskRepository.findAllByPageable(pageable, userId);
        Page<TaskResponse> taskResponses = tasks.map(taskMapper::toTaskResponse);
        return new TaskResponseWrapper(
                taskResponses.getTotalPages(),
                taskResponses.getTotalElements(),
                taskResponses.getContent()
        );
    }

    public TaskResponseWrapper getAllTask() {
        List<Task> tasks = taskRepository.findAll();

        List<TaskResponse> taskResponses = tasks.stream()
                .map(taskMapper::toTaskResponse)
                .toList();

        return new TaskResponseWrapper(
                1,
                taskResponses.size(),
                taskResponses
        );
    }


    // Chạy mỗi 1 giờ để kiểm tra task sắp hết hạn
    @Scheduled(fixedRate = 3600000) // 1 giờ
    @Transactional
    public void processTaskNotifications() {
        List<Task> tasks = checkTasksForNotification();
        for (Task task : tasks) {
            sendNotification(task);
            task.setIsNotified(1);
            taskRepository.save(task);
        }
    }


    @Transactional
    @Scheduled(cron = "0 */5 * * * *")
    public List<Task> checkTasksForNotification() {
        ZoneId vietnamZone = ZoneId.of("Asia/Ho_Chi_Minh");

        LocalDateTime nowVietnam = LocalDateTime.now(vietnamZone);
        LocalDateTime notifyThresholdVietnam = nowVietnam.plusHours(1);

        LocalDateTime now = nowVietnam.atZone(vietnamZone).toLocalDateTime();
        LocalDateTime notifyThreshold = notifyThresholdVietnam.atZone(vietnamZone).toLocalDateTime();

        System.out.println("🔎 Kiểm tra task từ (Việt Nam): " + nowVietnam + " đến: " + notifyThresholdVietnam);

        List<Task> tasks = taskRepository.findByDueDateBetweenAndIsNotifiedFalse(now, notifyThreshold);

        System.out.println("📋 Tổng số task lấy được: " + tasks.size());

        return tasks;
    }


    private void sendNotification(Task task) {
        notificationService.sendTaskNotification(task);
    }

    //create task
    public TaskResponse createTask(TaskRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Task newTask = taskMapper.toUser(request);
        newTask.setUser(user);
        newTask.setTitle(request.getTitle());
        newTask.setDescription(request.getDescription());
        newTask.setStatus(request.getStatus());
        newTask.setPriority(request.getPriority());
        newTask.setDueDate(request.getDueDate());
        newTask.setIsNotified(0);

        // Sử dụng LocalDateTime thay vì Date
        newTask.setCreatedAt(LocalDateTime.now());
        newTask.setUpdatedAt(LocalDateTime.now());

        taskRepository.save(newTask);

        return taskMapper.toTaskResponse(newTask);
    }

    //update task

    public TaskResponse updateTask(Long taskId, TaskRequest taskRequest) {
        Task task = taskRepository.findById(taskId).orElseThrow(() -> new AppException(ErrorCode.TASK_NOT_EXITS));

        User user = userRepository.findById(taskRequest.getUserId()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        task.setUser(user);
        task.setTitle(taskRequest.getTitle());
        task.setDescription(taskRequest.getDescription());
        task.setDueDate(task.getDueDate());
        task.setPriority(task.getPriority());
        task.setStatus(task.getStatus());
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());

        taskRepository.save(task);

        return taskMapper.toTaskResponse(task);
    }

    //delete task by id
    public boolean deleteTask(Long id) {
        var taskDelete = taskRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.TASK_NOT_EXITS));
        taskRepository.deleteById(id);
        return true;
    }

    public boolean updateTaskStatus(Long id) {
        Optional<Task> taskUpdate = taskRepository.findById(id);
        if (taskUpdate.isPresent()) {
            Task task = taskUpdate.get();
            if ("Đang thực hiện".equals(task.getStatus())) {
                task.setStatus("Đã hoàn thành");
                taskRepository.save(task);
                return true;
            }
            return false;
        }
        return false;
    }

    public TaskResponseWrapper filterTasks(Pageable pageable, Long userId, String priority, String title) {
        Page<Task> tasks;
        if (priority != null && title != null) {
            tasks = taskRepository.findByUserIdAndPriorityAndTitleContainingIgnoreCase(userId, priority, title, pageable);
        } else if (priority != null) {
            tasks = taskRepository.findByUserIdAndPriority(userId, priority, pageable);
        } else if (title != null) {
            tasks = taskRepository.findByUserIdAndTitleContainingIgnoreCase(userId, title, pageable);
        } else {
            tasks = taskRepository.findByUserId(userId, pageable);
        }

        Page<TaskResponse> taskResponses = tasks.map(taskMapper::toTaskResponse);
        return new TaskResponseWrapper(
                taskResponses.getTotalPages(),
                taskResponses.getTotalElements(),
                taskResponses.getContent()
        );



    }
    public List<TaskByDateResponse> getTasksByDay(Long userId) {
        return taskRepository.countCompletedTasksByDay(userId).stream()
                .map(row -> new TaskByDateResponse((String) row[0], (Long) row[1]))
                .toList();
    }

    public List<CompletionRatioResponse> getCompletionRatio(Long userId) {
        return taskRepository.getCompletionRatio(userId).stream()
                .map(row -> new CompletionRatioResponse((String) row[0], (Long) row[1]))
                .toList();
    }

    public List<TaskByPriorityResponse> getTasksByPriority(Long userId) {
        return taskRepository.countTasksByPriority(userId).stream()
                .map(row -> new TaskByPriorityResponse((String) row[0], (Long) row[1]))
                .toList();
    }

    public List<OverdueTaskResponse> getOverdueTasks(Long userId) {
        return taskRepository.countOverdueTasksByDate(userId).stream()
                .map(row -> {
                    // Handle the date conversion
                    java.sql.Date sqlDate = (java.sql.Date) row[0];
                    String dateString = sqlDate.toLocalDate().toString(); // Convert to String
                    Long count = (Long) row[1];
                    return new OverdueTaskResponse(dateString, count);
                })
                .toList();
    }
}

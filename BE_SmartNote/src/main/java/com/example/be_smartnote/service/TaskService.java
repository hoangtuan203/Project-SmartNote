package com.example.be_smartnote.service;

import com.example.be_smartnote.dto.request.TaskRequest;
import com.example.be_smartnote.dto.response.NoteResponse;
import com.example.be_smartnote.dto.response.TaskResponse;
import com.example.be_smartnote.dto.response.TaskResponseWrapper;
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

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
@Slf4j
@Service
@Transactional
public class TaskService {
    private final TaskMapper taskMapper;
    private final TaskRepository taskRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    public TaskService(TaskRepository taskRepository, TaskMapper taskMapper, NotificationService notificationService,
                       UserRepository userRepository){
        this.taskRepository = taskRepository;
        this.taskMapper = taskMapper;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    //get all and pagination
    public TaskResponseWrapper getAllTask(Pageable pageable) {
        Page<Task> tasks = taskRepository.findAllByPageable(pageable);
        Page<TaskResponse> taskResponses = tasks.map(taskMapper::toTaskResponse);
        return new TaskResponseWrapper(
                taskResponses.getTotalPages(),
                taskResponses.getTotalElements(),
                taskResponses.getContent()
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
    public TaskResponse createTask(TaskRequest request){

        log.info("User id : {}", request.getUserId());
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

    public TaskResponse updateTask(Long taskId, TaskRequest taskRequest){
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

}

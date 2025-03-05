package com.example.be_smartnote.service;

import com.example.be_smartnote.dto.response.TaskResponse;
import com.example.be_smartnote.dto.response.TaskResponseWrapper;
import com.example.be_smartnote.entities.Task;
import com.example.be_smartnote.mapper.TaskMapper;
import com.example.be_smartnote.repository.TaskRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@Transactional
public class TaskService {
    private final TaskMapper taskMapper;
    private final TaskRepository taskRepository;
    public TaskService(TaskRepository taskRepository, TaskMapper taskMapper){
        this.taskRepository = taskRepository;
        this.taskMapper = taskMapper;
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

    // Trả về danh sách task sắp hết hạn (trong vòng 1 giờ)
//    @Transactional
//    public List<Task> checkTasksForNotification() {
//        Instant now = Instant.now();
//        Instant notifyThreshold = now.plus(1, ChronoUnit.HOURS);
//
//        return taskRepository.findByDueDateBetweenAndIsNotifiedFalse(now, notifyThreshold);
//    }



    @Transactional
    public List<Task> checkTasksForNotification() {
        ZoneId vietnamZone = ZoneId.of("Asia/Ho_Chi_Minh");
        ZonedDateTime nowVietnam = ZonedDateTime.now(vietnamZone);
        ZonedDateTime notifyThresholdVietnam = nowVietnam.plus(1, ChronoUnit.HOURS);

        // Chuyển đổi về UTC để truy vấn DB
        Instant now = nowVietnam.toInstant();
        Instant notifyThreshold = notifyThresholdVietnam.toInstant();


        System.out.println("🔎 Kiểm tra task từ (Việt Nam): " + now + " đến: " + notifyThreshold);

        List<Task> tasks = taskRepository.findByDueDateBetweenAndIsNotifiedFalse(now, notifyThreshold);

        System.out.println("📋 Tổng số task lấy được: " + tasks.size());


        return tasks;
    }


    private void sendNotification(Task task) {
        System.out.println("🔔 Task sắp hết hạn: " + task.getTitle() + " (Deadline: " + task.getDueDate() + ")");
    }

}

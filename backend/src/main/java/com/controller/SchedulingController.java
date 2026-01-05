package com.scheduler.controller;

import com.scheduler.model.Process;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scheduler")
public class SchedulingController {

    @PostMapping("/fcfs")
    public List<Process> fcfs(@RequestBody List<Process> processes) {
        // Implement FCFS scheduling logic
    }

    @PostMapping("/sjf")
    public List<Process> sjf(@RequestBody List<Process> processes) {
        // Implement SJF scheduling logic
    }

    @PostMapping("/rr")
    public List<Process> roundRobin(@RequestBody List<Process> processes, @RequestParam int quantum) {
        // Implement Round Robin scheduling logic
    }
}

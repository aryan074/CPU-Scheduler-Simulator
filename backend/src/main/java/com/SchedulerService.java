package com.scheduler;

import java.util.*;

public class SchedulerService {

    public List<Process> fcfs(List<Process> processes) {
        processes.sort(Comparator.comparingInt(Process::getArrivalTime));
        return processes;
    }

    public List<Process> sjf(List<Process> processes) {
        processes.sort(Comparator.comparingInt(Process::getBurstTime));
        return processes;
    }

    public List<Process> roundRobin(List<Process> processes, int quantum) {
        // Implement Round Robin logic
        return processes;
    }

    public List<Process> priorityScheduling(List<Process> processes) {
        processes.sort(Comparator.comparingInt(Process::getPriority));
        return processes;
    }
}

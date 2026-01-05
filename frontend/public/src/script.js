function parseProcesses(input) {
    return input.split(',').map(proc => {
        const [id, arrival, burst] = proc.trim().split(' ');
        return { id, arrival: parseInt(arrival), burst: parseInt(burst) };
    });
}

function FCFS(processes) {
    processes.sort((a, b) => a.arrival - b.arrival);
    let time = 0;
    return processes.map(proc => {
        const start = Math.max(time, proc.arrival);
        const end = start + proc.burst;
        time = end;
        return { id: proc.id, start, end };
    });
}

function SJF(processes) {
    processes.sort((a, b) => a.arrival - b.arrival);
    let time = 0;
    let readyQueue = [];
    let result = [];

    while (processes.length || readyQueue.length) {
        while (processes.length && processes[0].arrival <= time) {
            readyQueue.push(processes.shift());
        }
        if (readyQueue.length) {
            readyQueue.sort((a, b) => a.burst - b.burst);
            const proc = readyQueue.shift();
            const start = Math.max(time, proc.arrival);
            const end = start + proc.burst;
            time = end;
            result.push({ id: proc.id, start, end });
        } else {
            time++;
        }
    }
    return result;
}

function RR(processes, quantum) {
    let time = 0;
    let schedule = [];
    let queue = [];
    let remaining = {};
    let arrivalMap = new Map();

    processes.forEach(p => {
        remaining[p.id] = p.burst;
        arrivalMap.set(p.id, p.arrival);
    });

    processes.sort((a, b) => a.arrival - b.arrival);
    let allProcesses = [...processes];

    while (queue.length > 0 || allProcesses.length > 0) {
        // Add new processes to the queue
        while (allProcesses.length > 0 && allProcesses[0].arrival <= time) {
            queue.push(allProcesses.shift());
        }

        if (queue.length === 0) {
            // Jump to the next process if queue is empty
            time = allProcesses[0].arrival;
            continue;
        }

        let current = queue.shift();
        const execTime = Math.min(quantum, remaining[current.id]);
        const start = time;
        const end = time + execTime;
        schedule.push({ id: current.id, start, end });

        time = end;
        remaining[current.id] -= execTime;

        // Add newly arrived processes while this one was executing
        while (allProcesses.length > 0 && allProcesses[0].arrival <= time) {
            queue.push(allProcesses.shift());
        }

        // If not finished, requeue it
        if (remaining[current.id] > 0) {
            queue.push(current);
        }
    }

    return schedule;
}

function startSimulation() {
    const algorithm = document.getElementById('algorithm').value;
    const input = document.getElementById('processes').value;
    const processes = parseProcesses(input);

    let schedule;
    if (algorithm === 'FCFS') {
        schedule = FCFS(processes);
    } else if (algorithm === 'SJF') {
        schedule = SJF(processes);
    } else if (algorithm === 'RR') {
        const quantum = parseInt(prompt('Enter time quantum:'));
        schedule = RR(processes, quantum);
    }

    drawGanttChart(schedule);
    displayTable(schedule, processes);
}

function displayTable(schedule, originalProcesses) {
    const tbody = document.querySelector('#resultTable tbody');
    tbody.innerHTML = '';

    let totalWT = 0, totalTAT = 0;
    let procMap = new Map(originalProcesses.map(p => [p.id, { ...p }]));

    schedule.forEach(({ id, start, end }) => {
        const proc = procMap.get(id);
        if (!proc.start) proc.start = start;
        proc.end = end;
    });

    const results = [];
    procMap.forEach((proc, id) => {
        const ct = proc.end;
        const tat = ct - proc.arrival;
        const wt = tat - proc.burst;

        totalTAT += tat;
        totalWT += wt;

        results.push({ id, arrival: proc.arrival, burst: proc.burst, ct, tat, wt });
    });

    results.sort((a, b) => a.arrival - b.arrival); // Optional sorting

    results.forEach(proc => {
        const row = `<tr>
            <td>${proc.id}</td>
            <td>${proc.arrival}</td>
            <td>${proc.burst}</td>
            <td>${proc.ct}</td>
            <td>${proc.tat}</td>
            <td>${proc.wt}</td>
        </tr>`;
        tbody.innerHTML += row;
    });

    document.getElementById('avgTAT').textContent = (totalTAT / results.length).toFixed(2);
    document.getElementById('avgWT').textContent = (totalWT / results.length).toFixed(2);
}

function drawGanttChart(schedule) {
    const ctx = document.getElementById('ganttChart').getContext('2d');
    const labels = schedule.map(proc => proc.id);
    const data = schedule.map(proc => proc.end - proc.start);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Process Execution',
                data,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Process ID'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Execution Time'
                    }
                }
            }
        }
    });
}

import React, { useState } from 'react';
import ProcessForm from './components/ProcessForm';
import ProcessTable from './components/ProcessTable';
import SchedulerOutput from './components/SchedulerOutput';

const App = () => {
    const [processes, setProcesses] = useState([]);
    const [output, setOutput] = useState('');

    const addProcess = (process) => {
        setProcesses([...processes, process]);
    };

    const handleSchedule = async (algorithm, quantum) => {
        const response = await fetch(`/api/scheduler/${algorithm}?quantum=${quantum}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(processes),
        });
        const data = await response.json();
        setOutput(JSON.stringify(data, null, 2));
    };

    return (
        <div>
            <h1>CPU Scheduling Simulator</h1>
            <ProcessForm addProcess={addProcess} />
            <ProcessTable processes={processes} />
            <button onClick={() => handleSchedule('fcfs')
::contentReference[oaicite:35]{index=35}
 

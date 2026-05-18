import { Plus, MoreHorizontal, Clock, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

function Worklist() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick Create Task form
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState('To Do');

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await fetch('http://localhost:8080/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTaskTitle,
          status: newTaskStatus,
          assignee: 'Unassigned',
          priority: 'Medium'
        })
      });

      if (response.ok) {
        setNewTaskTitle('');
        setIsAddingTask(false);
        fetchTasks(); // refresh
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      const response = await fetch(`http://localhost:8080/api/tasks/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleUpdateStatus = async (task: any, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/tasks/${task.ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...task,
          status: newStatus
        })
      });
      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const columns = [
    { title: 'To Do', color: 'bg-gray-100', dotColor: 'bg-gray-400', items: tasks.filter(t => t.status === 'To Do') },
    { title: 'In Progress', color: 'bg-blue-50', dotColor: 'bg-blue-500', items: tasks.filter(t => t.status === 'In Progress') },
    { title: 'Completed', color: 'bg-green-50', dotColor: 'bg-green-500', items: tasks.filter(t => t.status === 'Completed' || t.status === 'Done') }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="mb-8 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Engagement Worklist</h2>
          <p className="text-gray-500 mt-1">Track tasks and progress for active penetration testing scopes.</p>
        </div>
        <div className="flex gap-3 items-center">
          {isAddingTask ? (
            <form onSubmit={handleCreateTask} className="flex gap-2 items-center bg-white p-2 rounded-lg shadow-sm border border-gray-200">
              <input 
                type="text" 
                value={newTaskTitle} 
                onChange={(e) => setNewTaskTitle(e.target.value)} 
                placeholder="Task title..."
                className="px-3 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-light)]"
                autoFocus
                required
              />
              <select value={newTaskStatus} onChange={e => setNewTaskStatus(e.target.value)} className="px-3 py-1 border border-gray-200 rounded text-sm bg-white">
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <button type="submit" className="bg-[var(--color-brand-primary)] text-white px-3 py-1 rounded text-sm hover:bg-[var(--color-brand-dark)]">Add</button>
              <button type="button" onClick={() => setIsAddingTask(false)} className="text-gray-500 hover:text-gray-700 text-sm px-2">Cancel</button>
            </form>
          ) : (
            <button onClick={() => setIsAddingTask(true)} className="bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-dark)] text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer">
              <Plus className="w-5 h-5" />
              Add Task
            </button>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-6 h-full min-w-max pb-4">
          {columns.map((column, index) => (
            <div key={index} className={`w-80 flex flex-col rounded-xl border border-gray-200 ${column.color}`}>
              {/* Column Header */}
              <div className="p-4 flex items-center justify-between border-b border-gray-200/50">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${column.dotColor}`}></div>
                  <h3 className="font-bold text-gray-700">{column.title}</h3>
                  <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-gray-500 shadow-sm border border-gray-100">
                    {column.items.length}
                  </span>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Task Cards Container */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar">
                {loading && <div className="text-sm text-center text-gray-400 py-4">Loading tasks...</div>}
                {column.items.map((task) => (
                  <div key={task.ID} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-[var(--color-brand-light)] hover:shadow-md transition-all group relative">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-gray-100 text-gray-600">
                        Task
                      </span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <select 
                          className="text-xs border border-gray-200 rounded px-1 py-0.5 text-gray-600 bg-gray-50 cursor-pointer focus:outline-none focus:border-[var(--color-brand-light)]"
                          value={task.status}
                          onChange={(e) => handleUpdateStatus(task, e.target.value)}
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                        <button onClick={() => handleDeleteTask(task.ID)} className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 text-sm mb-3 leading-snug">
                      {task.title}
                    </h4>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                        {task.priority === 'Critical' && <AlertCircle className="w-4 h-4 text-red-500" />}
                        {task.priority === 'High' && <AlertCircle className="w-4 h-4 text-orange-500" />}
                        {task.priority === 'Medium' && <Clock className="w-4 h-4 text-yellow-500" />}
                        {task.priority === 'Low' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                        <span>{task.priority || 'Medium'} Priority</span>
                      </div>
                      
                      <div className="w-6 h-6 rounded-full bg-[var(--color-brand-primary)] text-white text-xs font-bold flex items-center justify-center">
                        {task.assignee ? task.assignee.charAt(0).toUpperCase() : 'U'}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add task button at bottom of col */}
                <button type="button" onClick={() => { setIsAddingTask(true); setNewTaskStatus(column.title); }} className="w-full flex justify-center py-2 text-gray-400 hover:text-[var(--color-brand-primary)] hover:bg-white/50 rounded-lg transition-colors cursor-pointer border border-dashed border-transparent hover:border-gray-300 text-sm font-medium">
                  + Add Item
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Worklist;
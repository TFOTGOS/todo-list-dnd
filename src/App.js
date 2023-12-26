import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './App.css';

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: 16,
  margin: `0 0 8px 0`,
  background: isDragging ? 'lightgreen' : 'white',
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: 8,
  width: 250,
});

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const updatedTasks = [...tasks];
    const [reorderedItem] = updatedTasks.splice(result.source.index, 1);
    updatedTasks.splice(result.destination.index, 0, reorderedItem);

    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleAddTask = () => {
    const newTask = {
      id: Date.now(),
      content: newTaskText || `Task ${tasks.length + 1}`,
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    setNewTaskText('');
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleRemoveTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleEditTask = (taskId, newContent) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, content: newContent } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  return (
    <div className="app-container">
      <h1>Todo List</h1>
      <input
        type="text"
        placeholder="Enter task"
        value={newTaskText}
        onChange={(e) => setNewTaskText(e.target.value)}
      />
      <button onClick={handleAddTask}>Add Task</button>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <input
                        type="text"
                        value={task.content}
                        onChange={(e) => handleEditTask(task.id, e.target.value)}
                      />
                      <button onClick={() => handleRemoveTask(task.id)}>Remove</button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default App;

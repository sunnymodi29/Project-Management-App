import Button from "./Button";
import Tasks from "./Tasks";

const SelectedProject = ({
  project,
  onAddTask,
  onDeleteTask,
  onEditTask,
  tasks,
  onBack,
  updateTaskStatus,
}) => {
  const formattedDate = new Date(project.dueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="w-[35rem] mt-5">
      <div className="mb-8">
        <Button onClick={onBack} type="cancel">
          Cancel
        </Button>
      </div>
      <header className="pb-4 mb-4 border-b-2 border-x-stone-300">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-stone-600">{project.title}</h1>
          <p className="text-stone-400">{formattedDate}</p>
        </div>
        <p className="text-stone-600 whitespace-pre-wrap">
          {project.description}
        </p>
      </header>
      <Tasks
        onTaskAdd={onAddTask}
        onTaskDelete={onDeleteTask}
        onEditTask={onEditTask}
        tasks={tasks}
        updateTaskStatus={updateTaskStatus}
      />
    </div>
  );
};

export default SelectedProject;

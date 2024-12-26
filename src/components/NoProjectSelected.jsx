import noProjectImg from "../assets/no-projects.png";
import Button from "./Button";

const NoProjectSelected = ({ onStartAddProject }) => {
  return (
    <div className="mt-24 text-center w-full px-4 md:px-0">
      <img
        src={noProjectImg}
        alt="An Empty Task List"
        className="w-16 h-16 object-contain mx-auto"
      />
      <h2 className="text-xl font-bold text-stone-500 my-4">
        No Project Selected
      </h2>
      <p className="text-stone-400 mb-4">
        Select a project or get started <br className="block md:hidden" /> with a new one
      </p>
      <p className="mt-8">
        <Button onClick={onStartAddProject} type="normal">Create New Project</Button>
      </p>
    </div>
  );
};

export default NoProjectSelected;

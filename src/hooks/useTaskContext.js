import { TaskContext } from "../context/TaskContext";
import { useContext } from "react";


export const useTaskContext = () => {
    const context = useContext(TaskContext);
        if(!context) {
            throw Error('useTaskContext must be used in a TaskContextProvider')
        }
    return context
}

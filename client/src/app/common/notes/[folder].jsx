import NotesComponent from "@components/common/Notes.jsx";
import { useAppStore } from "@store/app.store.js";

const Folder = () => {
    const role = useAppStore(state=> state.user.role)
    return <NotesComponent role={role} />;
};

export default Folder;
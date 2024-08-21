import "../App.css";
import { db } from "../firebase";
import { uid } from "uid";
import { set, ref, onValue, update, remove } from "firebase/database";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../component/AuthProvider";

function Skill2() {
  const [title, setTitle] = useState("");
  const [todo, setTodo] = useState("");
  const [image, setImage] = useState("");
  const [todos, setTodos] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const todosRef = ref(db, '/items');
    onValue(todosRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        const updateTodos = Object.values(data);
        setTodos(updateTodos);
      }
    });
  }, []);

  const writeToDatabase = () => {
    const uidValue = uid();
    set(ref(db, `/items/${uidValue}`), {
      title,
      todo,
      image,
      uid: uidValue,
    });
    setTodos([...todos, { title, todo, image, uid: uidValue }]);
  };

  const handleUpdate = (item) => {
    setIsEdit(true);
    setEditingItem(item);
    setTitle(item.title);
    setTodo(item.todo);
    setImage(item.image);
  };

  const handleSubmitChange = () => {
    if (editingItem) {
      const uidValue = editingItem.uid;
      update(ref(db, `/items/${uidValue}`), {
        title,
        todo,
        image,
        uid: editingItem.uid,
      });
      const updatedTodos = todos.map((item) => {
        if (item.uid === uidValue) {
          return { title, todo, image, uid: uidValue };
        }
        return item;
      });
      setTodos(updatedTodos);
      setTitle("");
      setTodo("");
      setImage("");
      setIsEdit(false);
      setEditingItem(null);
    }
  };
const handleDelete = (item) => {
  console.log(`Deleting item with UID: ${item.uid}`); // Tambahkan log untuk memeriksa UID
  remove(ref(db, `/items/${item.uid}`))
    .then(() => {
      console.log(`Successfully deleted item with UID: ${item.uid}`);
    })
    .catch((error) => {
      console.error(`Error deleting item with UID: ${item.uid}`, error);
    });
};

  const context = useContext(AuthContext);
  const user = context?.user;

  if (user === null) {
    return (
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:gap-6 xl:gap-8 mt-8">
        {todos.map((item) => (
          <div
            key={item.uid}
            className="mb-[20px] text-white relative bg-gray-700/20 p-4 rounded-3xl flex flex-col place-content-between"
          >
            <div>
              <p className="text- overflow-hidden text-ellipsis">
                <img src={item.image} className="px-5" alt={item.title} />
              </p>
              <h1 className="text-gray-600 overflow-hidden text-ellipsis">
                {item.title}
              </h1>
              <p className="text-white overflow-hidden text-ellipsis">
                {item.todo}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="App py-10" id="skill">
      <h2 className="mb-8 text-3xl text-white text-center">
        My <span>Skill</span>
      </h2>
      <div className="mx-[300px] text-black relative bg-gray-700/20 p-6 rounded-3xl flex flex-col">
        <input
          type="text"
          value={image}
          className="rounded pt-[5px]"
          onChange={(e) => setImage(e.target.value)}
          placeholder="url gambar"
        />
        <br />
        <input
          type="text"
          value={title}
          className="rounded pt-[5px]"
          onChange={(e) => setTitle(e.target.value)}
          placeholder="skill"
        />
        <br />
        <input
          type="text"
          value={todo}
          className="rounded pt-[5px]"
          onChange={(e) => setTodo(e.target.value)}
          placeholder="deskripsi"
        />
        {isEdit ? (
          <div>
            <button
              className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-4 px-4 rounded mr-1"
              onClick={handleSubmitChange}
            >
              Simpan perubahan
            </button>
            <button
              className="text-white bg-gray-700 hover:bg-gray-800 font-bold mt-[20px] py-4 px-4 rounded ml-1"
              onClick={() => {
                setIsEdit(false);
                setTitle("");
                setImage("");
                setTodo("");
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div>
            <button
              className="text-white bg-gray-700 hover:bg-gray-800 font-bold mt-[20px] py-4 px-4 rounded"
              onClick={writeToDatabase}
            >
              Submit
            </button>
          </div>
        )}
      </div>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:gap-6 xl:gap-8 mt-8">
        {todos.map((item) => (
          <div
            key={item.uid}
            className="mb-[20px] text-white relative bg-gray-700/20 p-4 rounded-3xl flex flex-col place-content-between"
          >
            <div>
              <p className="text- overflow-hidden text-ellipsis">
                <img src={item.image} className="px-5" alt={item.title} />
              </p>
              <h1 className="text-gray-600 overflow-hidden text-ellipsis">
                {item.title}
              </h1>
              <p className="text-white overflow-hidden text-ellipsis">
                {item.todo}
              </p>
            </div>
            <div className="flex justify-around mt-4">
              <button
                className="text-white bg-gray-700 hover:bg-gray-800 font-bold py-2 px-4 rounded"
                onClick={() => handleUpdate(item)}
              >
                Update
              </button>
              <button
                className="text-white bg-gray-700 hover:bg-gray-800 font-bold py-2 px-4 rounded"
                onClick={() => handleDelete(item)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Skill2;

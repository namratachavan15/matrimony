import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../Config/api";


const StoryContext = createContext();
export const useStoryContext = () => useContext(StoryContext);

export const StoryProvider = ({ children }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ GET ALL
  const fetchStories = async () => {
    setLoading(true);
    const res = await api.get("/api/admin/story");
    setStories(res.data);
    setLoading(false);
  };

  // ✅ CREATE (multipart/form-data ✅✅✅)
  const createStory = async (storyObj, photo) => {
    const formData = new FormData();

    formData.append("story", JSON.stringify(storyObj));
    formData.append("photo", photo);

    await api.post("/api/admin/story/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    fetchStories();
  };

  // ✅ DELETE
  const deleteStory = async (id) => {
    await api.delete(`/api/admin/story/${id}`);
    setStories((prev) => prev.filter((s) => s.id !== id));
  };

  // ✅ SEARCH
  const searchStory = async (query) => {
    const res = await api.get(`/api/admin/story/search?query=${query}`);
    setStories(res.data);
  };

  // ✅ UPDATE (multipart/form-data ✅✅✅)
  const updateStory = async (id, storyObj, photo) => {
    const formData = new FormData();

    formData.append("story", JSON.stringify(storyObj));

    if (photo) {
      formData.append("photo", photo);
    }

    await api.put(`/api/admin/story/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    fetchStories();
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <StoryContext.Provider
      value={{
        stories,
        fetchStories,
        createStory,
        deleteStory,
        searchStory,
        loading,
        updateStory,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
};

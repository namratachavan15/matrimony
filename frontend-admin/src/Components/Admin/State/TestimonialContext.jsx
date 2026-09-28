import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../../Config/api";

const TestimonialContext = createContext();
export const useTestimonialContext = () => useContext(TestimonialContext);

export const TestimonialProvider = ({ children }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);

  // GET ALL
  const fetchTestimonials = async () => {
    setLoading(true);
    const res = await api.get("/api/admin/testimonial");
    setTestimonials(res.data);
    setLoading(false);
  };

  // CREATE
  const createTestimonial = async (obj, photo) => {
    const formData = new FormData();
    formData.append("testimonial", JSON.stringify(obj));
    formData.append("photo", photo);

    await api.post("/api/admin/testimonial/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    fetchTestimonials();
  };

  // DELETE
  const deleteTestimonial = async (id) => {
    await api.delete(`/api/admin/testimonial/${id}`);
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  // UPDATE
  const updateTestimonial = async (id, obj, photo) => {
    const formData = new FormData();
    formData.append("testimonial", JSON.stringify(obj));
    if(photo) formData.append("photo", photo);

    await api.put(`/api/admin/testimonial/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    fetchTestimonials();
  };

  useEffect(() => { fetchTestimonials(); }, []);

  return (
    <TestimonialContext.Provider value={{
      testimonials,
      fetchTestimonials,
      createTestimonial,
      deleteTestimonial,
      updateTestimonial,
      loading
    }}>
      {children}
    </TestimonialContext.Provider>
  );
};

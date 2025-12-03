import { useState, useEffect } from "react";
import { useCourses } from "@/hooks/use-courses";
import { Course } from "@/types";

interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course // you can replace with your Course type
}

export default function EditCourseModal({ isOpen, onClose, course }: EditCourseModalProps) {
  const { updateCourse } = useCourses();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructor, setInstructor] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setDescription(course.description || "");
      setInstructor(course.instructor);
      setCategory(course.category || "");
      setPrice(course.price || 0);
    }
  }, [course]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

  await updateCourse(
    course._id,
    {
      title,
      description,
      instructor,
      category,
      price,
    }
  );

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-xl shadow-lg w-[500px] animate-scale-in">

        <h2 className="text-xl font-semibold mb-4">Edit Course</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Instructor"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            required
          />

          <textarea
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <input
            type="number"
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90"
            >
              Update
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

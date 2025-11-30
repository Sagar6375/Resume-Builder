import { GraduationCap, Plus, Sparkles, Trash2} from "lucide-react";
import React from "react";

export default function EducationForm({ data, onChange }) {
  const addEducation = () => {
    const newEducation = {
      institution: "",
      degree: "",
      field: "",
      graduation_date: "",
      gpa: "",
    };
    onChange([...data, newEducation]);
  };

  const removeEducation = (index) => {
    const update = data.filter((_, i) => i !== index);
    onChange(update);
  };

  const updateEducation = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };
  return(
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Education 
          </h3>
          <p className="text-sm text-gray-500">Add Your Education details</p>
        </div>

        <button
          onClick={addEducation}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
        >
          <Plus className="size-4" />
          Add Education
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No Education added yet.</p>
          <p className="text-sm">Click "Add Education" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((Education, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              <div className="flex justify-between items-start">
                <h4>Education #{index + 1}</h4>
                <button
                  onClick={() => removeEducation(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              {/* The content for the Education item would go here */}
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  value={Education.institution || ""}
                  onChange={(e) =>
                    updateEducation(index, "institution", e.target.value)
                  }
                  type="text"
                  placeholder="institution Name"
                  className="px-3 py-2 text-sm"
                />

                <input
                  value={Education.degree || ""}
                  onChange={(e) =>
                    updateEducation(index, "degree", e.target.value)
                  }
                  type="text"
                  placeholder="Degree (e.g., Bachelor's, Master's)"
                  className="px-3 py-2 text-sm"
                />

                <input
                  value={Education.field || ""}
                  onChange={(e) =>
                    updateEducation(index, "field", e.target.value)
                  }
                  type="text"
                  placeholder="field of study"
                  className="px-3 py-2 text-sm "
                />

                <input
                  value={Education.graduation_date || ""}
                  onChange={(e) =>
                    updateEducation(index, "graduation_date", e.target.value)
                  }
                  type="month"
                  className="px-3 py-2 text-sm "
                />
              </div>

             <input
                  value={Education.gpa || ""}
                  onChange={(e) =>
                    updateEducation(index, "gpa", e.target.value)
                  }
                  type="text"
                  placeholder="GPA (optional)"
                  className="px-3 py-2 text-sm "
                />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Project, Expenditure } from '../../types/types';
import { projectService } from '../../services/projectService';
import { userService } from '../../services/userService';
import { ArrowLeft, Upload, X, File } from 'lucide-react';

const EXPENDITURE_CATEGORIES = [
  'Materials',
  'Labor',
  'Equipment',
  'Subcontractors',
  'Logistics',
  'Administrative',
  'Permits',
  'Other'
];

interface AddExpenditureSectionProps {
  project: Project | null;
  userId: string;
  onBack: () => void;
  onAddExpenditure: (expenditure: Omit<Expenditure, 'id'>) => void;
}

export function AddExpenditureSection({
  project: initialProject,
  userId,
  onBack,
  onAddExpenditure
}: AddExpenditureSectionProps) {
  const [project, setProject] = useState<Project | null>(initialProject);
  const [loading, setLoading] = useState(!initialProject);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (project) return;

    const fetchProject = async () => {
      try {
        setLoading(true);
        // Get user to find their project ID
        const user = await userService.getUser(userId);
        if (user && user.projectId) {
          // Ideally use a getProjectById, but for now filtering all projects
          const projects = await projectService.getAllProjects();
          const foundProject = projects.find(p => p.id === user.projectId);
          if (foundProject) {
            setProject(foundProject);
          }
        }
      } catch (err) {
        console.error('Error fetching project for expenditure:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [userId, project]);

  const [attachments, setAttachments] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments([...attachments, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    // Convert files to base64 URLs for demo purposes
    const attachmentData = attachments.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file), // In production, this would be uploaded to a server
    }));

    onAddExpenditure({
      projectId: project.id,
      category: formData.category,
      amount: parseFloat(formData.amount),
      description: formData.description,
      date: formData.date,
      createdBy: userId,
      status: 'pending',
      attachments: attachmentData.length > 0 ? attachmentData : undefined,
    });

    onBack();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Error: Project not found. Please contact support.</p>
        <button onClick={onBack} className="mt-4 text-indigo-600 hover:underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-gray-900 mb-2">Add New Expenditure</h2>
          <p className="text-gray-600">Project: {project.name}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select category</option>
                {EXPENDITURE_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Amount (₹)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter description..."
              rows={4}
              required
            />
          </div>

          {/* File Upload Section */}
          <div>
            <label className="block text-gray-700 mb-2">Attachments (Optional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
              <input
                type="file"
                id="file-upload"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                <span className="text-gray-700 mb-1">Click to upload files</span>
                <span className="text-gray-500 text-sm">PDF, DOC, XLS, Images (Max 10MB each)</span>
              </label>
            </div>

            {/* Uploaded Files List */}
            {attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                <div className="text-gray-700 mb-2">Uploaded Files ({attachments.length})</div>
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <File className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-gray-900 truncate">{file.name}</div>
                        <div className="text-gray-500 text-sm">{formatFileSize(file.size)}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Add Expenditure
            </button>
          </div>
        </form>
      </div>

      {/* Project Budget Info */}
      <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-6">
        <h4 className="text-gray-900 mb-4">Project Budget Information</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-gray-600 text-sm mb-1">Total Budget</div>
            <div className="text-gray-900">₹{project.budget.toLocaleString('en-IN')}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm mb-1">Already Spent</div>
            <div className="text-gray-900">₹{project.totalExpenditure.toLocaleString('en-IN')}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm mb-1">Remaining</div>
            <div className="text-gray-900">₹{(project.budget - project.totalExpenditure).toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
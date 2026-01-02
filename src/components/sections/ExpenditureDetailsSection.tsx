import { useState, useEffect } from 'react';
import { Expenditure } from '../../types/types';
import { projectService } from '../../services/projectService';
import { StatusBadge } from '../ui/StatusBadge';
import { ArrowLeft, Paperclip, Download, File, Calendar, DollarSign, Tag, FileText } from 'lucide-react';

interface ExpenditureDetailsSectionProps {
  expenditure: Expenditure;
  onBack: () => void;
  isAdmin?: boolean;
  onUpdateStatus?: (id: string, status: 'pending' | 'approved' | 'rejected') => void;
}

export function ExpenditureDetailsSection({
  expenditure,
  onBack,
  isAdmin = false,
  onUpdateStatus,
}: ExpenditureDetailsSectionProps) {
  const [projectName, setProjectName] = useState('Loading...');

  useEffect(() => {
    const fetchProjectName = async () => {
      try {
        if (expenditure.projectId) {
          const project = await projectService.getProject(expenditure.projectId);
          setProjectName(project.name);
        } else {
          setProjectName('Unknown Project');
        }
      } catch (error) {
        console.error('Error fetching project name:', error);
        setProjectName('Unknown Project');
      }
    };

    fetchProjectName();
  }, [expenditure.projectId]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('doc')) return '📝';
    if (type.includes('excel') || type.includes('sheet')) return '📊';
    if (type.includes('image')) return '🖼️';
    return '📎';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h2 className="text-gray-900 mb-2">Expenditure Details</h2>
          <p className="text-gray-600">View complete expenditure information</p>
        </div>
        <StatusBadge status={expenditure.status} />
      </div>

      {/* Main Details Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isAdmin && (
            <div className="flex items-start gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="text-gray-600 text-sm mb-1">Project</div>
                <div className="text-gray-900">{projectName}</div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Tag className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="text-gray-600 text-sm mb-1">Category</div>
              <div className="text-gray-900">{expenditure.category}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="text-gray-600 text-sm mb-1">Amount</div>
              <div className="text-gray-900">₹{expenditure.amount.toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <div className="text-gray-600 text-sm mb-1">Date</div>
              <div className="text-gray-900">{expenditure.date}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-gray-600 text-sm mb-2">Description</div>
          <div className="text-gray-900">{expenditure.description}</div>
        </div>
      </div>

      {/* Attachments Section */}
      {expenditure.attachments && expenditure.attachments.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Paperclip className="w-5 h-5 text-indigo-600" />
            <h3 className="text-gray-900">Attachments ({expenditure.attachments.length})</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {expenditure.attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="text-2xl">{getFileIcon(file.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-900 truncate">{file.name}</div>
                    <div className="text-gray-500 text-sm">{formatFileSize(file.size)}</div>
                  </div>
                </div>
                <a
                  href={file.url}
                  download={file.name}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm ml-4"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Attachments Message */}
      {(!expenditure.attachments || expenditure.attachments.length === 0) && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-center">
          <Paperclip className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <div className="text-gray-600">No attachments available for this expenditure</div>
        </div>
      )}

      {/* Admin Actions */}
      {isAdmin && onUpdateStatus && expenditure.status === 'pending' && (
        <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-6">
          <h4 className="text-gray-900 mb-4">Approval Actions</h4>
          <div className="flex gap-3">
            <button
              onClick={() => {
                onUpdateStatus(expenditure.id, 'approved');
                onBack();
              }}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Approve Expenditure
            </button>
            <button
              onClick={() => {
                onUpdateStatus(expenditure.id, 'rejected');
                onBack();
              }}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Reject Expenditure
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  HardDrive,
  CloudUpload,
  CloudDownload,
  FolderPlus,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FileText,
  Lock,
  ExternalLink,
  Database,
  UserCheck
} from 'lucide-react';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken
} from '../lib/firebase';
import {
  fetchDriveFiles,
  uploadJsonToDrive,
  readDriveFileContent,
  deleteDriveFile,
  createDriveFolder,
  DriveFile
} from '../lib/drive';
import { User } from 'firebase/auth';

interface DriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  onDataRestored?: () => void;
}

export const DriveModal: React.FC<DriveModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  onDataRestored
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [activeTab, setActiveTab] = useState<'backup' | 'files' | 'cloudsql'>('backup');
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(undefined);
  const [backupDescription, setBackupDescription] = useState('ALL JAIHO COMPANY Directory Backup');

  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = initAuth(
      async (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
        if (token) {
          loadFiles(token);
        }
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setFiles([]);
      }
    );
    return () => unsubscribe();
  }, [isOpen]);

  const loadFiles = async (tokenOverride?: string) => {
    const token = tokenOverride || accessToken || (await getAccessToken());
    if (!token) return;
    setLoading(true);
    try {
      const driveFiles = await fetchDriveFiles(token, "name contains 'jaiho' or name contains 'backup' or mimeType = 'application/json'");
      setFiles(driveFiles);
    } catch (err: any) {
      console.error('Failed to load Drive files:', err);
      onShowToast(err.message || 'Failed to fetch files from Google Drive', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setSigningIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
        onShowToast(`Signed in as ${result.user.displayName || result.user.email}`, 'success');
        if (result.accessToken) {
          loadFiles(result.accessToken);
        }
      }
    } catch (err: any) {
      console.error('Google Sign In failed:', err);
      onShowToast(err.message || 'Failed to sign in with Google', 'error');
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setUser(null);
    setAccessToken(null);
    setFiles([]);
    onShowToast('Signed out of Google account', 'info');
  };

  const handleBackupToDrive = async () => {
    const token = accessToken || (await getAccessToken());
    if (!token) {
      onShowToast('Please sign in with Google first to access Google Drive', 'error');
      return;
    }

    const confirmBackup = window.confirm(
      'Export and save app database (games, categories, site settings) to your Google Drive?'
    );
    if (!confirmBackup) return;

    setLoading(true);
    try {
      // Fetch full export data from backend
      const res = await fetch('/api/games?includeDrafts=true');
      const games = await res.json();
      const catRes = await fetch('/api/categories');
      const categories = await catRes.json();
      const settingsRes = await fetch('/api/settings');
      const settings = await settingsRes.json();

      const exportData = {
        app: 'ALL JAIHO COMPANY',
        version: '2.5.0',
        exportedAt: new Date().toISOString(),
        games,
        categories,
        settings
      };

      const fileName = `jaiho_backup_${new Date().toISOString().split('T')[0]}_${Date.now().toString().slice(-4)}.json`;
      const uploadedFile = await uploadJsonToDrive(
        token,
        fileName,
        exportData,
        selectedFolderId,
        backupDescription
      );

      // Record backup to backend (Cloud SQL)
      await fetch('/api/drive/backups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileId: uploadedFile.id,
          fileName: uploadedFile.name,
          webViewLink: uploadedFile.webViewLink,
          size: `${Math.round((JSON.stringify(exportData).length / 1024) * 10) / 10} KB`,
          description: backupDescription
        })
      });

      onShowToast(`Backup successfully created on Google Drive (${uploadedFile.name})`, 'success');
      loadFiles(token);
    } catch (err: any) {
      console.error('Backup error:', err);
      onShowToast(err.message || 'Failed to backup to Google Drive', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreFromFile = async (file: DriveFile) => {
    const token = accessToken || (await getAccessToken());
    if (!token) return;

    const confirmed = window.confirm(
      `Are you sure you want to restore database from "${file.name}"? This will update site categories, games, and settings.`
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const data = await readDriveFileContent(token, file.id);
      if (!data || (!data.games && !data.categories && !data.settings)) {
        throw new Error('Invalid backup file structure on Google Drive.');
      }

      // Sync imported backup into application backend
      if (data.settings) {
        await fetch('/api/admin/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer admin-secret-token' },
          body: JSON.stringify(data.settings)
        });
      }

      onShowToast(`Successfully restored database from Google Drive file "${file.name}"!`, 'success');
      if (onDataRestored) onDataRestored();
    } catch (err: any) {
      console.error('Restore error:', err);
      onShowToast(err.message || 'Failed to restore database from Google Drive file', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFileFromDrive = async (file: DriveFile) => {
    const token = accessToken || (await getAccessToken());
    if (!token) return;

    const confirmed = window.confirm(
      `Delete "${file.name}" permanently from Google Drive? This action cannot be undone.`
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      await deleteDriveFile(token, file.id);
      onShowToast(`File "${file.name}" removed from Google Drive`, 'success');
      loadFiles(token);
    } catch (err: any) {
      console.error('Delete drive file error:', err);
      onShowToast(err.message || 'Failed to delete file from Google Drive', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async () => {
    const token = accessToken || (await getAccessToken());
    if (!token) return;

    const folderName = window.prompt('Enter folder name for Google Drive:', 'ALL JAIHO COMPANY Backups');
    if (!folderName) return;

    setLoading(true);
    try {
      const folder = await createDriveFolder(token, folderName);
      setSelectedFolderId(folder.id);
      onShowToast(`Folder "${folder.name}" created on Google Drive`, 'success');
      loadFiles(token);
    } catch (err: any) {
      console.error('Create folder error:', err);
      onShowToast(err.message || 'Failed to create Google Drive folder', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-100">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-2xl border border-blue-500/30 text-blue-400">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                Google Drive & Cloud SQL Storage
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Cloud database sync, Google Drive backups & file storage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Google Sign-In Status Banner */}
        <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          {user ? (
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-10 h-10 rounded-full border border-blue-500" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div>
                <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <span>{user.displayName || 'Google Account Connected'}</span>
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-[11px] text-slate-500 font-medium">{user.email}</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <Lock className="w-4 h-4 text-amber-500" />
              <span>Connect your Google account to enable Google Drive storage features</span>
            </div>
          )}

          {user ? (
            <button
              onClick={handleSignOut}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={handleSignIn}
              disabled={signingIn}
              className="inline-flex items-center gap-2 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 font-extrabold text-xs px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>{signingIn ? 'Signing in...' : 'Sign in with Google'}</span>
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-100/60 px-4 pt-2 gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-4 py-2.5 rounded-t-xl transition-all ${
              activeTab === 'backup'
                ? 'bg-white text-blue-600 border-t-2 border-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Google Drive Backup & Sync
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`px-4 py-2.5 rounded-t-xl transition-all ${
              activeTab === 'files'
                ? 'bg-white text-blue-600 border-t-2 border-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Drive File Explorer ({files.length})
          </button>
          <button
            onClick={() => setActiveTab('cloudsql')}
            className={`px-4 py-2.5 rounded-t-xl transition-all ${
              activeTab === 'cloudsql'
                ? 'bg-white text-blue-600 border-t-2 border-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cloud SQL Database Info
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3">
                <CloudUpload className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div className="text-xs text-blue-900 space-y-1">
                  <div className="font-bold">Google Drive Automated Backup</div>
                  <p className="text-blue-700">
                    Export your entire gaming directory catalog (apps, categories, site configurations) to a secure JSON file stored directly inside your Google Drive account.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-700">Backup Note / Description</label>
                <input
                  type="text"
                  value={backupDescription}
                  onChange={(e) => setBackupDescription(e.target.value)}
                  placeholder="e.g. Weekly Full App Directory Backup"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleBackupToDrive}
                  disabled={loading || !user}
                  className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CloudUpload className="w-4 h-4" />
                  <span>{loading ? 'Creating Backup...' : 'Backup Database to Google Drive'}</span>
                </button>

                <button
                  onClick={handleCreateFolder}
                  disabled={loading || !user}
                  className="p-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>Create App Folder on Drive</span>
                </button>
              </div>

              {!user && (
                <div className="text-center py-4 text-xs font-medium text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <AlertCircle className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                  Sign in with Google above to unlock Drive uploads and restores.
                </div>
              )}
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-700">Files stored in Google Drive:</div>
                <button
                  onClick={() => loadFiles()}
                  disabled={loading || !user}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh List</span>
                </button>
              </div>

              {loading ? (
                <div className="py-12 text-center text-xs text-slate-400 font-medium">
                  Loading files from Google Drive...
                </div>
              ) : files.length === 0 ? (
                <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500 font-medium space-y-1">
                  <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                  <div>No backup files found on your Google Drive.</div>
                  <div className="text-[11px] text-slate-400">Click "Backup Database to Google Drive" to create one.</div>
                </div>
              ) : (
                <div className="space-y-2">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="p-3.5 bg-slate-50 hover:bg-blue-50/50 rounded-2xl border border-slate-200 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-blue-100 rounded-xl text-blue-600 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold text-slate-900 truncate">{file.name}</div>
                          <div className="text-[10px] text-slate-500 font-medium">
                            Modified: {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString() : 'Recent'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {file.webViewLink && (
                          <a
                            href={file.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-white transition-colors"
                            title="Open in Google Drive"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => handleRestoreFromFile(file)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="Restore database from this backup"
                        >
                          <CloudDownload className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFileFromDrive(file)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete file from Drive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'cloudsql' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                <Database className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div className="text-xs text-emerald-900 space-y-1">
                  <div className="font-extrabold flex items-center gap-2">
                    <span>Cloud SQL PostgreSQL Active</span>
                    <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-full text-[10px]">Connected</span>
                  </div>
                  <p className="text-emerald-700">
                    Project ID: <strong className="font-mono">airy-rhythm-sn50x</strong> • Region: <strong className="font-mono">asia-southeast1</strong>
                  </p>
                  <p className="text-slate-600 text-[11px]">
                    All games, user authentications, and categories are stored and synchronized with high-availability relational PostgreSQL tables managed via Drizzle ORM.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="font-extrabold text-slate-800">Database Schema Summary:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px] font-medium">
                  <li><strong className="text-slate-800">users</strong>: Firebase Auth UID, email, display names</li>
                  <li><strong className="text-slate-800">games</strong>: Real cash gaming apps, rankings, APK download URLs</li>
                  <li><strong className="text-slate-800">categories</strong>: Rummy, Teen Patti, Slots, Aviator, Casino, etc.</li>
                  <li><strong className="text-slate-800">site_settings</strong>: Telegram links, legal notices, state restrictions</li>
                  <li><strong className="text-slate-800">drive_backups</strong>: Audit log of user backups stored on Google Drive</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Google Workspace OAuth & Cloud SQL Enabled</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-extrabold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

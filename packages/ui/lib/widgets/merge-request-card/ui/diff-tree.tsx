'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, Skeleton, Badge } from '@/index';
import { ChevronRight, ChevronDown, FileText, FolderOpen, Folder, Plus, Minus, FileCode } from 'lucide-react';
import type { FileChange } from '../types';
import { DiffViewer } from './diff-viewer';
import type { ChangeModel } from '@extension/shared';

interface DiffTreeProps {
  changes?: Promise<ChangeModel | undefined> | undefined;
}

// Function to optimize file structure by collapsing single-item folders
const optimizeFileStructure = (files: ChangeModel['files']) => {
  // Create a map of all paths and their parent paths
  const pathMap = new Map<string, string[]>();

  files.forEach(file => {
    const parts = file.path.split('/');
    let currentPath = '';

    for (let i = 0; i < parts.length - 1; i++) {
      const parentPath = currentPath;
      currentPath = currentPath ? `${currentPath}/${parts[i]}` : parts[i];

      if (!pathMap.has(currentPath)) {
        pathMap.set(currentPath, []);
      }

      if (parentPath) {
        const children = pathMap.get(parentPath) || [];
        if (!children.includes(currentPath)) {
          children.push(currentPath);
          pathMap.set(parentPath, children);
        }
      }
    }

    // Add the file to its parent folder
    const parentPath = parts.slice(0, parts.length - 1).join('/');
    if (parentPath) {
      const children = pathMap.get(parentPath) || [];
      if (!children.includes(file.path)) {
        children.push(file.path);
        pathMap.set(parentPath, children);
      }
    }
  });

  // Return the original files - the optimization will happen in the TreeFolder component
  return files;
};

export function DiffTree({ changes }: DiffTreeProps) {
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [processedFiles, setProcessedFiles] = useState<FileChange[]>([]);
  const [data, setData] = useState<ChangeModel | undefined>();
  const [stats, setStats] = useState({
    additions: 0,
    deletions: 0,
    added: 0,
    modified: 0,
    removed: 0,
  });

  //   const diffContent = useMemo(() => {
  //     if (data?.files) {
  //       return data?.files.reduce((acc, file) => {
  //         // In a real implementation, this would come from the API
  //         // For now, we'll use a placeholder diff for demonstration
  // //                       const diffContent = `@@ -1,5 +1,5 @@
  // // // Example diff content for ${file.path}
  // // ${file.status === "added" ? "+ This is a new file" : ""}
  // // ${file.status === "deleted" ? "- This file was deleted" : ""}
  // // ${file.status === "modified" ? "- Old content\n+ New content" : ""}
  // // ${file.additions > 0 ? `+ Added ${file.additions} lines` : ""}
  // // ${file.deletions > 0 ? `- Removed ${file.deletions} lines` : ""}`
  //
  //         return {
  //           ...acc,
  //           [file.path]: file.diff,
  //         }
  //       }, {})
  //     }
  //
  //     return {}
  //   }, [data])

  const diff = data?.files ? data.files.find(file => file.path === selectedFile)?.diff : null;

  useEffect(() => {
    changes
      ?.then(res => {
        if (!res) {
          return;
        }

        setData(res);

        // Process files to calculate accurate stats
        const newStats = {
          additions: 0,
          deletions: 0,
          added: 0,
          modified: 0,
          removed: 0,
        };

        res.files.forEach(file => {
          newStats.additions += file.additions;
          newStats.deletions += file.deletions;

          if (file.status === 'added') newStats.added++;
          else if (file.status === 'deleted') newStats.removed++;
          else if (file.status === 'modified') newStats.modified++;
        });

        setStats(newStats);

        // Process files to optimize folder structure
        const optimizedFiles = optimizeFileStructure(res.files);
        setProcessedFiles(optimizedFiles);
      })
      .finally(() => {
        setLoading(false);
      });

    // Simulate loading delay for diff tree
    const timer = setTimeout(() => {
      setLoading(false);

      if (!changes) {
        return;
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [changes]);

  if (loading || !data) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Changes</h3>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-5 w-64" />
              </div>

              <div className="rounded-md border p-2">
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex items-center p-2">
                      <Skeleton className="mr-1 size-4" />
                      <Skeleton className="mr-1 size-4" />
                      <Skeleton className="h-4 w-40" />
                      <div className="ml-auto flex items-center space-x-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Changes</h3>

      <Card>
        <CardContent className="p-4">
          <div className="text-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Plus className="mr-1 size-4 text-green-500" />
                  <span>{stats.added} added</span>
                </div>
                <div className="flex items-center">
                  <Minus className="mr-1 size-4 text-red-500" />
                  <span>{stats.removed} removed</span>
                </div>
                <div className="flex items-center">
                  <FileText className="mr-1 size-4 text-blue-500" />
                  <span>{stats.modified} modified</span>
                </div>
              </div>

              <span className="text-gray-500">
                {data.totalFiles} files changed with {stats.additions} additions and {stats.deletions} deletions
              </span>
            </div>

            <div className="rounded-md border">
              <TreeFolder
                name="/"
                files={data.files}
                level={0}
                onFileClick={setSelectedFile}
                selectedFile={selectedFile}
              />
            </div>

            {selectedFile && diff && (
              <div className="mt-4">
                <h4 className="mb-2 text-sm font-medium">File: {selectedFile}</h4>
                <DiffViewer diff={diff} language={selectedFile.split('.').pop() || 'txt'} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface TreeFolderProps {
  name: string;
  files: FileChange[];
  level: number;
  onFileClick: (path: string) => void;
  selectedFile: string | null;
}

function TreeFolder({ name, files, level, onFileClick, selectedFile }: TreeFolderProps) {
  const [expanded, setExpanded] = useState(true);

  // Group files by directory with optimized structure
  const filesByDirectory: Record<string, FileChange[]> = {};
  const directChildren: Record<string, boolean> = {};

  // First pass: identify direct children of this folder
  files.forEach(file => {
    const relativePath =
      name === '/' ? file.path : file.path.startsWith(name + '/') ? file.path.substring(name.length + 1) : file.path;

    const parts = relativePath.split('/');

    if (parts.length === 1) {
      // This is a direct file in the current directory
      if (!filesByDirectory['']) {
        filesByDirectory[''] = [];
      }
      filesByDirectory[''].push(file);
      directChildren[file.path] = true;
    } else {
      // This is a file in a subdirectory
      const nextDir = parts[0];
      directChildren[name === '/' ? nextDir : `${name}/${nextDir}`] = true;

      if (!filesByDirectory[nextDir]) {
        filesByDirectory[nextDir] = [];
      }
      filesByDirectory[nextDir].push(file);
    }
  });

  // Get directories and check for single-item folders to collapse
  const directories = Object.keys(filesByDirectory).filter(dir => dir !== '');
  const currentFiles = filesByDirectory[''] || [];

  // Identify directories with only one child that can be collapsed
  const collapsibleDirs: Record<string, { path: string; isFile: boolean }> = {};

  directories.forEach(dir => {
    const dirFiles = filesByDirectory[dir];
    if (dirFiles.length === 1) {
      // Check if this is the only item in this path
      const file = dirFiles[0];
      const relativePath = file.path.substring((name === '/' ? '' : name + '/').length);
      const parts = relativePath.split('/');

      if (parts.length === 2) {
        // This is a direct file in a subdirectory with no siblings
        collapsibleDirs[dir] = {
          path: file.path,
          isFile: true,
        };
      }
    }
  });

  return (
    <div>
      {name !== '/' && (
        <div
          className={`flex cursor-pointer items-center p-2 hover:bg-gray-50`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          role="button"
          tabIndex={0}
          onClick={() => setExpanded(!expanded)}>
          {expanded ? (
            <ChevronDown className="mr-1 size-4 text-gray-500" />
          ) : (
            <ChevronRight className="mr-1 size-4 text-gray-500" />
          )}

          {expanded ? (
            <FolderOpen className="mr-1 size-4 text-yellow-500" />
          ) : (
            <Folder className="mr-1 size-4 text-yellow-500" />
          )}

          <span className="font-medium">{name.split('/').pop()}</span>
        </div>
      )}

      {expanded && (
        <>
          {/* Render files in current directory */}
          {currentFiles.map((file, index) => (
            <div
              key={index}
              className={`flex cursor-pointer items-center p-2 hover:bg-gray-50 ${
                selectedFile === file.path ? 'bg-blue-50' : ''
              }`}
              style={{ paddingLeft: `${level * 16 + 24}px` }}
              onClick={() => onFileClick(file.path)}>
              <FileCode className="mr-1 size-4 text-blue-500" />
              <span>{file.path.split('/').pop()}</span>

              <div className="ml-auto flex items-center space-x-2">
                <Badge
                  variant="outline"
                  className={
                    file.status === 'added'
                      ? 'bg-green-100 text-green-800'
                      : file.status === 'deleted'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                  }>
                  {file.status}
                </Badge>

                <span className="text-xs text-gray-500">
                  {file.additions > 0 && <span className="text-green-600">+{file.additions}</span>}
                  {file.additions > 0 && file.deletions > 0 && ' '}
                  {file.deletions > 0 && <span className="text-red-600">-{file.deletions}</span>}
                </span>
              </div>
            </div>
          ))}

          {/* Render subdirectories */}
          {directories.map((dir, index) => {
            const dirPath = name === '/' ? dir : `${name}/${dir}`;
            const dirFiles = filesByDirectory[dir];

            // Check if this directory should be collapsed (has only one file and no subdirectories)
            const collapsible = collapsibleDirs[dir];

            if (collapsible && collapsible.isFile) {
              // Render collapsed directory+file as a single item
              const file = dirFiles[0];
              return (
                <div
                  key={index}
                  className={`flex cursor-pointer items-center p-2 hover:bg-gray-50 ${
                    selectedFile === file.path ? 'bg-blue-50' : ''
                  }`}
                  style={{ paddingLeft: `${level * 16 + 24}px` }}
                  onClick={() => onFileClick(file.path)}>
                  <FileCode className="mr-1 size-4 text-blue-500" />
                  <span>
                    {dir}/{file.path.split('/').pop()}
                  </span>

                  <div className="ml-auto flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className={
                        file.status === 'added'
                          ? 'bg-green-100 text-green-800'
                          : file.status === 'deleted'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                      }>
                      {file.status}
                    </Badge>

                    <span className="text-xs text-gray-500">
                      {file.additions > 0 && <span className="text-green-600">+{file.additions}</span>}
                      {file.additions > 0 && file.deletions > 0 && ' '}
                      {file.deletions > 0 && <span className="text-red-600">-{file.deletions}</span>}
                    </span>
                  </div>
                </div>
              );
            }

            // Otherwise render as a normal directory
            return (
              <TreeFolder
                key={index}
                name={dirPath}
                files={dirFiles}
                level={level + 1}
                onFileClick={onFileClick}
                selectedFile={selectedFile}
              />
            );
          })}
        </>
      )}
    </div>
  );
}

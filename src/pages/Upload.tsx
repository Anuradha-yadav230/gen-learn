import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload as UploadIcon, File, X, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { gsap } from 'gsap';
import { useEffect } from 'react';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
}

export default function Upload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const filesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current, 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  useEffect(() => {
    // Animate new files
    filesRef.current.forEach((fileEl, index) => {
      if (fileEl) {
        gsap.fromTo(fileEl,
          { opacity: 0, x: 50, scale: 0.8 },
          { opacity: 1, x: 0, scale: 1, duration: 0.4, delay: index * 0.1, ease: "back.out(1.7)" }
        );
      }
    });
  }, [files]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (selectedFiles: FileList) => {
    const newFiles: UploadedFile[] = Array.from(selectedFiles).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type.startsWith('image/') ? 'image' : 'document'
    }));

    setFiles(prev => [...prev, ...newFiles]);
    
    toast({
      title: "Files Uploaded Successfully",
      description: `${newFiles.length} file(s) added to your study materials.`,
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
    toast({
      title: "File Removed",
      description: "File removed from your study materials.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-3">Upload Study Materials</h1>
        <p className="text-muted-foreground text-lg">
          Upload PDFs, images, or documents to create personalized study guides
        </p>
      </div>

      {/* Upload Card */}
      <Card ref={cardRef} className="glass-card border-2 border-dashed border-primary/30 hover:border-primary/60 transition-colors duration-300">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UploadIcon className="w-5 h-5" />
            <span>Upload Files</span>
          </CardTitle>
          <CardDescription>
            Drag and drop files here or click to browse. Supports PDF, images, and text documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              isDragOver 
                ? 'border-primary bg-primary/5 scale-105' 
                : 'border-muted-foreground/30 hover:border-primary/50'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
          >
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                <UploadIcon className="w-8 h-8 text-primary-foreground" />
              </div>
              
              <div>
                <p className="text-lg font-medium mb-2">
                  {isDragOver ? 'Drop files here' : 'Drag & drop files here'}
                </p>
                <p className="text-muted-foreground mb-4">or</p>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="gradient-btn"
                >
                  Browse Files
                </Button>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.txt,.doc,.docx"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Uploaded Files ({files.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div
                  key={file.id}
                  ref={el => filesRef.current[index] = el!}
                  className="flex items-center justify-between p-4 glass-card rounded-lg hover:scale-105 transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center">
                      <File className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{file.size}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
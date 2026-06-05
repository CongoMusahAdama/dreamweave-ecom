import { useEffect, useId, useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { ADMIN_LABEL } from '@/admin/lib/apiForm';
import { cn } from '@/lib/utils';

export type ImageRole = 'front' | 'back' | 'additional';

export type ProductImageEntry = {
  id: string;
  file: File;
  preview: string;
  role: ImageRole;
};

type ProductImagePickerProps = {
  images: ProductImageEntry[];
  onChange: (images: ProductImageEntry[]) => void;
  maxImages?: number;
};

const ROLE_OPTIONS: { value: ImageRole; label: string }[] = [
  { value: 'front', label: 'Front' },
  { value: 'back', label: 'Back' },
  { value: 'additional', label: 'Extra' },
];

function nextId() {
  return `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const ProductImagePicker = ({ images, onChange, maxImages = 6 }: ProductImagePickerProps) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef(images);

  useEffect(() => {
    imagesRef.current = images;
  });

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, []);

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;

    const remaining = maxImages - images.length;
    const picked = Array.from(files).slice(0, remaining);

    const next = picked.map((file, index) => ({
      id: nextId(),
      file,
      preview: URL.createObjectURL(file),
      role: (images.length === 0 && index === 0 ? 'front' : 'additional') as ImageRole,
    }));

    onChange([...images, ...next]);
    if (inputRef.current) inputRef.current.value = '';
  };

  const updateRole = (id: string, role: ImageRole) => {
    onChange(images.map((img) => (img.id === id ? { ...img, role } : img)));
  };

  const removeImage = (id: string) => {
    const target = images.find((img) => img.id === id);
    if (target) URL.revokeObjectURL(target.preview);
    onChange(images.filter((img) => img.id !== id));
  };

  return (
    <div>
      <span className={ADMIN_LABEL}>Product images *</span>
      <p className="text-[9px] font-bold text-black/40 uppercase tracking-wider mb-3">
        Add one or more photos. Choose front, back, or extra for each.
      </p>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
          {images.map((img) => (
            <div key={img.id} className="border border-black/15 bg-white">
              <div className="relative aspect-square bg-black/[0.03]">
                <img
                  src={img.preview}
                  alt="Product preview"
                  className="w-full h-full object-contain p-1"
                />
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="absolute top-1 right-1 min-h-[32px] min-w-[32px] flex items-center justify-center bg-black/75 text-white hover:bg-black"
                  aria-label="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <label className="block p-2 border-t border-black/10">
                <span className="sr-only">Image view</span>
                <select
                  value={img.role}
                  onChange={(e) => updateRole(img.id, e.target.value as ImageRole)}
                  className="w-full border border-black/15 bg-white px-2 py-2 min-h-[40px] text-[9px] font-bold uppercase tracking-wider text-black"
                >
                  {ROLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => addFiles(e.target.files)}
        disabled={images.length >= maxImages}
      />
      <label
        htmlFor={inputId}
        className={cn(
          'inline-flex items-center justify-center gap-2 border border-dashed border-black/25 px-4 py-3 min-h-[48px] text-[9px] font-bold tracking-[0.12em] uppercase cursor-pointer hover:border-black/40 hover:bg-black/[0.02] transition-colors',
          images.length >= maxImages && 'opacity-40 pointer-events-none'
        )}
      >
        <ImagePlus className="w-4 h-4 shrink-0" />
        {images.length === 0 ? 'Add images' : 'Add more images'}
      </label>
      {images.length >= maxImages && (
        <p className="text-[8px] font-bold uppercase text-black/35 mt-2">
          Maximum {maxImages} images
        </p>
      )}
    </div>
  );
};

export default ProductImagePicker;

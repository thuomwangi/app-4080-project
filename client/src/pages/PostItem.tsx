import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Upload, X, Check, Eye, ImagePlus, Save } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useListings } from "@/context/ListingsContext";
import { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const STEPS = ["Basic Info", "Details", "Photos", "Pricing", "Review"];

const CATEGORIES = ["Electronics", "Furniture", "Books", "Clothing", "Study Gear", "Sports"];
const CONDITIONS: Product["condition"][] = ["New", "Like New", "Good", "Fair"];
const DELIVERY_OPTIONS = ["Pickup on campus", "Delivery within campus", "Shipping"];

const categoryFields: Record<string, string[]> = {
  Electronics: ["Brand", "Model", "Year"],
  Furniture: ["Material", "Dimensions", "Color"],
  Books: ["Author", "Edition", "ISBN"],
  Clothing: ["Brand", "Size", "Color"],
  "Study Gear": ["Brand", "Type"],
  Sports: ["Brand", "Size", "Sport"],
};

interface FormData {
  title: string;
  category: string;
  condition: string;
  description: string;
  extras: Record<string, string>;
  photos: string[];
  price: string;
  negotiable: boolean;
  delivery: string[];
}

const emptyForm: FormData = {
  title: "",
  category: "",
  condition: "",
  description: "",
  extras: {},
  photos: [],
  price: "",
  negotiable: false,
  delivery: [],
};

const PostItem = () => {
  const { isAuthenticated, user } = useAuth();
  const { addListing, saveDraft } = useListings();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [published, setPublished] = useState(false);
  const [publishedId, setPublishedId] = useState("");

  // Redirect unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center text-center px-4">
          <div>
            <h1 className="mb-2 text-2xl font-bold">Sign in to start selling</h1>
            <p className="mb-6 text-muted-foreground">You need an account to list items on CampusCart.</p>
            <Button onClick={() => navigate("/login?redirect=/post-item&role=seller")} size="lg">
              Sign In to Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!form.title.trim()) e.title = "Title is required";
      if (!form.category) e.category = "Select a category";
      if (!form.condition) e.condition = "Select condition";
    }
    if (step === 1 && !form.description.trim()) e.description = "Description is required";
    if (step === 3) {
      if (!form.price || parseFloat(form.price) <= 0) e.price = "Enter a valid price";
      if (form.delivery.length === 0) e.delivery = "Select at least one delivery option";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm((f) => ({ ...f, photos: [...f.photos, ev.target?.result as string] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (idx: number) => {
    setForm((f) => ({ ...f, photos: f.photos.filter((_, i) => i !== idx) }));
  };

  const handleDraft = () => {
    saveDraft(form);
    toast({ title: "Draft saved", description: "You can resume editing later from the dashboard." });
  };

  const handlePublish = () => {
    const id = `user-${Date.now()}`;
    const listing: Product = {
      id,
      name: form.title,
      price: parseFloat(form.price),
      image: form.photos[0] || "/placeholder.svg",
      images: form.photos.length ? form.photos : ["/placeholder.svg"],
      category: form.category,
      condition: form.condition as Product["condition"],
      location: "Campus",
      seller: user?.name || "You",
      sellerAvatar: user?.name?.charAt(0).toUpperCase() || "U",
      description: form.description,
      specs: form.extras,
      rating: 0,
      reviews: 0,
    };
    addListing(listing);
    setPublishedId(id);
    setPublished(true);
  };

  if (published) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center text-center px-4">
          <div className="max-w-md">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
              <Check className="h-10 w-10 text-success" />
            </div>
            <h1 className="mb-2 text-2xl font-bold">Listing Published!</h1>
            <p className="mb-8 text-muted-foreground">
              Your item "{form.title}" is now live on CampusCart and visible to buyers.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onClick={() => navigate(`/product/${publishedId}`)}>
                <Eye className="mr-2 h-4 w-4" /> View Listing
              </Button>
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const dynamicFields = form.category ? categoryFields[form.category] || [] : [];

  return (
    <div className="min-h-screen bg-section">
      <Header />

      <main id="main-content" className="container mx-auto max-w-3xl px-4 py-8">
        {/* Progress */}
        <nav className="mb-8" aria-label="Listing creation progress">
          <div className="flex items-center justify-between mb-2" role="list">
            {STEPS.map((label, i) => (
              <div key={label} className="flex flex-col items-center flex-1" role="listitem" aria-current={i === step ? "step" : undefined}>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                    i < step
                      ? "bg-success text-success-foreground"
                      : i === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                  aria-label={`Step ${i + 1}: ${label}${i < step ? ' (completed)' : i === step ? ' (current)' : ''}`}
                >
                  {i < step ? <Check className="h-4 w-4" aria-hidden="true" /> : i + 1}
                </div>
                <span className={`mt-1 text-[11px] font-medium hidden sm:block ${i === step ? "text-primary" : "text-muted-foreground"}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="relative h-1.5 rounded-full bg-muted mt-1" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={STEPS.length} aria-label={`Step ${step + 1} of ${STEPS.length}`}>
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all"
              style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
        </nav>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
          {/* Step 1 */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold">Basic Information</h2>
              <div>
                <label htmlFor="post-title" className="mb-1.5 block text-sm font-medium">Title <span className="text-destructive" aria-hidden="true">*</span><span className="sr-only">(required)</span></label>
                <Input
                  id="post-title"
                  placeholder="e.g. Ergonomic Study Desk"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  aria-invalid={!!errors.title}
                  aria-describedby={errors.title ? "title-error" : undefined}
                />
                {errors.title && <p id="title-error" className="mt-1 text-xs text-destructive" role="alert">{errors.title}</p>}
              </div>
              <div>
                <label htmlFor="post-category" className="mb-1.5 block text-sm font-medium">Category <span className="text-destructive" aria-hidden="true">*</span><span className="sr-only">(required)</span></label>
                <select
                  id="post-category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value, extras: {} })}
                  aria-invalid={!!errors.category}
                  aria-describedby={errors.category ? "category-error" : undefined}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.category && <p id="category-error" className="mt-1 text-xs text-destructive" role="alert">{errors.category}</p>}
              </div>
              <fieldset>
                <legend className="mb-1.5 block text-sm font-medium">Condition <span className="text-destructive" aria-hidden="true">*</span><span className="sr-only">(required)</span></legend>
                <div className="flex flex-wrap gap-2" role="radiogroup">
                  {CONDITIONS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      role="radio"
                      aria-checked={form.condition === c}
                      onClick={() => setForm({ ...form, condition: c })}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                        form.condition === c
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:bg-secondary"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                {errors.condition && <p className="mt-1 text-xs text-destructive" role="alert">{errors.condition}</p>}
              </fieldset>
            </div>
          )}

          {/* Step 2 */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold">Description & Details</h2>
              <div>
                <label htmlFor="post-description" className="mb-1.5 block text-sm font-medium">Description <span className="text-destructive" aria-hidden="true">*</span><span className="sr-only">(required)</span></label>
                <Textarea
                  id="post-description"
                  placeholder="Describe your item in detail..."
                  rows={5}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  aria-invalid={!!errors.description}
                  aria-describedby={errors.description ? "desc-error" : undefined}
                />
                {errors.description && <p id="desc-error" className="mt-1 text-xs text-destructive" role="alert">{errors.description}</p>}
              </div>
              {dynamicFields.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {dynamicFields.map((field) => (
                    <div key={field}>
                      <label htmlFor={`extra-${field}`} className="mb-1.5 block text-sm font-medium">{field}</label>
                      <Input
                        id={`extra-${field}`}
                        placeholder={field}
                        value={form.extras[field] || ""}
                        onChange={(e) =>
                          setForm({ ...form, extras: { ...form.extras, [field]: e.target.value } })
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3 */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold">Photos</h2>
              <p className="text-sm text-muted-foreground">Add up to 8 photos. The first image will be the cover.</p>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos} aria-label="Upload product photos" />
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4" role="list" aria-label="Uploaded photos">
                {form.photos.map((src, i) => (
                  <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-border" role="listitem">
                    <img src={src} alt={`Product photo ${i + 1}${i === 0 ? ' (cover image)' : ''}`} className="h-full w-full object-cover" />
                    <button
                      onClick={() => removePhoto(i)}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                      aria-label={`Remove photo ${i + 1}`}
                    >
                      <X className="h-3 w-3" aria-hidden="true" />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
                {form.photos.length < 8 && (
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                    aria-label={`Add photo, ${form.photos.length} of 8 uploaded`}
                  >
                    <ImagePlus className="h-6 w-6" aria-hidden="true" />
                    <span className="text-xs font-medium">Add Photo</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 4 */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold">Pricing & Delivery</h2>
              <div>
                <label htmlFor="post-price" className="mb-1.5 block text-sm font-medium">Price (KES) <span className="text-destructive" aria-hidden="true">*</span><span className="sr-only">(required)</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground" aria-hidden="true">KES</span>
                  <Input
                    id="post-price"
                    type="number"
                    placeholder="0.00"
                    className="pl-12"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    aria-invalid={!!errors.price}
                    aria-describedby={errors.price ? "price-error" : undefined}
                  />
                </div>
                {errors.price && <p id="price-error" className="mt-1 text-xs text-destructive" role="alert">{errors.price}</p>}
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div id="negotiable-label">
                  <p className="text-sm font-medium">Negotiable</p>
                  <p className="text-xs text-muted-foreground">Allow buyers to make offers</p>
                </div>
                <Switch checked={form.negotiable} onCheckedChange={(v) => setForm({ ...form, negotiable: v })} aria-labelledby="negotiable-label" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Delivery Options *</label>
                <div className="space-y-2">
                  {DELIVERY_OPTIONS.map((opt) => (
                    <label
                      key={opt}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors ${
                        form.delivery.includes(opt)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-secondary"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="accent-[hsl(var(--primary))]"
                        checked={form.delivery.includes(opt)}
                        onChange={() =>
                          setForm({
                            ...form,
                            delivery: form.delivery.includes(opt)
                              ? form.delivery.filter((d) => d !== opt)
                              : [...form.delivery, opt],
                          })
                        }
                      />
                      {opt}
                    </label>
                  ))}
                </div>
                {errors.delivery && <p className="mt-1 text-xs text-destructive">{errors.delivery}</p>}
              </div>
            </div>
          )}

          {/* Step 5 */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold">Review & Publish</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <ReviewField label="Title" value={form.title} />
                  <ReviewField label="Category" value={form.category} />
                  <ReviewField label="Condition" value={form.condition} />
                  <ReviewField label="Price" value={`KES ${form.price}`} />
                  <ReviewField label="Negotiable" value={form.negotiable ? "Yes" : "No"} />
                  <ReviewField label="Delivery" value={form.delivery.join(", ")} />
                </div>
                <div>
                  <p className="mb-1.5 text-xs font-medium text-muted-foreground">Description</p>
                  <p className="text-sm">{form.description}</p>
                  {Object.entries(form.extras).filter(([, v]) => v).length > 0 && (
                    <div className="mt-3 space-y-1">
                      {Object.entries(form.extras).filter(([, v]) => v).map(([k, v]) => (
                        <ReviewField key={k} label={k} value={v} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {form.photos.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Photos</p>
                  <div className="flex gap-2 overflow-x-auto">
                    {form.photos.map((src, i) => (
                      <img key={i} src={src} alt="" className="h-20 w-20 flex-shrink-0 rounded-lg border border-border object-cover" />
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Button variant="outline" className="gap-2" onClick={() => setPreviewOpen(true)}>
                  <Eye className="h-4 w-4" /> Preview Listing
                </Button>
                <Button className="gap-2 flex-1" size="lg" onClick={handlePublish}>
                  Publish Listing
                </Button>
              </div>
            </div>
          )}

          {/* Nav buttons */}
          {step < 4 && (
            <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
              <div>
                {step > 0 && (
                  <Button variant="outline" onClick={back} className="gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={handleDraft} className="gap-2 text-muted-foreground">
                  <Save className="h-4 w-4" /> Save Draft
                </Button>
                <Button onClick={next} className="gap-2">
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Listing Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {form.photos.length > 0 && (
              <img src={form.photos[0]} alt="" className="w-full rounded-lg object-cover max-h-64" />
            )}
            <h3 className="text-xl font-bold">{form.title}</h3>
            <div className="flex gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{form.category}</span>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">{form.condition}</span>
            </div>
            <p className="text-2xl font-bold text-primary">KES {form.price}</p>
            <p className="text-sm text-muted-foreground">{form.description}</p>
            {Object.entries(form.extras).filter(([, v]) => v).length > 0 && (
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(form.extras).filter(([, v]) => v).map(([k, v]) => (
                  <div key={k}>
                    <span className="text-muted-foreground">{k}:</span> <span className="font-medium">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

const ReviewField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs font-medium text-muted-foreground">{label}</p>
    <p className="text-sm font-medium">{value || "—"}</p>
  </div>
);

export default PostItem;

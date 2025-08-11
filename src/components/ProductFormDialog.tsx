'use client';

import { useState, useActionState, useEffect, useMemo } from 'react';
import { useFormStatus } from 'react-dom';
import { PlusCircle, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addProduct, updateProduct } from '@/app/actions/product';
import UploadImageField from '@/components/UploadImageField';
import { useToast } from '@/hooks/use-toast';

type Product = {
    id: string;
    title: string;
    price: number;
    cost?: number;
    discount_type?: 'percentage' | 'amount';
    discount_value?: number;
    stock: number;
    product_type: 'product' | 'service';
    images?: string[];
    product_variants?: any[];
};

type ProductFormDialogProps = {
    product?: Product;
    children?: React.ReactNode;
    triggerType?: 'button' | 'dropdownItem';
    triggerLabel?: string;
};

const initialState: any = {
  message: '',
  errors: {},
  success: false,
};

function SubmitButton({ isEditMode }: { isEditMode: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending}>
      {pending ? (isEditMode ? 'Saving...' : 'Adding...') : (isEditMode ? 'Save Changes' : 'Add Product')}
    </Button>
  );
}

type VariantOption = { name: string; stock?: number };
type Variant = { type: string; options: VariantOption[] };

export default function ProductFormDialog({ product, children, triggerType = 'button', triggerLabel }: ProductFormDialogProps) {
  const [open, setOpen] = useState(false);
  const isEditMode = !!product;

  const formAction = isEditMode ? updateProduct : addProduct;
  const [state, dispatchFormAction] = useActionState(formAction, initialState);

  const { toast } = useToast();
  
  const [variants, setVariants] = useState<Variant[]>([]);

  useEffect(() => {
    if (state.success) {
      toast({ title: "Success", description: state.message });
      setOpen(false);
      if (!isEditMode) {
        setVariants([]); // Reset variants on success for add mode
      }
    } else if (state.message && !state.success) {
      toast({ title: "Error", description: state.message, variant: 'destructive' });
    }
  }, [state, toast, isEditMode]);

  useEffect(() => {
    if(open) {
        // Convert product_variants from database format to component format
        const convertedVariants = product?.product_variants?.map((pv: any) => ({
          type: pv.variant_type,
          options: [{ name: pv.variant_name, stock: pv.stock }]
        })) || [];
        setVariants(convertedVariants);
    }
  }, [open, product?.product_variants]);
  
  const handleAddVariant = () => {
    setVariants([...variants, { type: '', options: [{ name: '', stock: undefined }] }]);
  };

  const handleRemoveVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  const handleVariantTypeChange = (index: number, type: string) => {
    const newVariants = [...variants];
    newVariants[index].type = type;
    setVariants(newVariants);
  };

  const handleAddVariantOption = (variantIndex: number) => {
    const newVariants = [...variants];
    newVariants[variantIndex].options.push({ name: '', stock: undefined });
    setVariants(newVariants);
  };

  const handleRemoveVariantOption = (variantIndex: number, optionIndex: number) => {
    const newVariants = [...variants];
    newVariants[variantIndex].options = newVariants[variantIndex].options.filter((_, i) => i !== optionIndex);
    setVariants(newVariants);
  };

  const handleVariantOptionChange = (variantIndex: number, optionIndex: number, field: 'name' | 'stock', value: string) => {
    const newVariants = [...variants];
    const option = newVariants[variantIndex].options[optionIndex];
    if (field === 'name') {
        option.name = value;
    } else {
        option.stock = value === '' ? undefined : Number(value);
    }
    setVariants(newVariants);
  };

  let Trigger: React.ReactNode = null;
  if (children) {
    // If children are provided, assume they are client components and wrap as trigger
    Trigger = <DialogTrigger asChild>{children}</DialogTrigger>;
  } else if (triggerType === 'dropdownItem') {
    // Render a button instead of passing a DropdownMenuItem directly (avoids onSelect leakage)
    Trigger = (
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          {triggerLabel || (isEditMode ? 'Edit' : 'Add Product')}
        </Button>
      </DialogTrigger>
    );
  } else {
    Trigger = (
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            {triggerLabel || 'Add Product'}
          </span>
        </Button>
      </DialogTrigger>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {Trigger}
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the details of your product below.' : 'Fill in the details below to add a new product to your store.'}
          </DialogDescription>
        </DialogHeader>
        <form action={dispatchFormAction} className="space-y-6">
          {isEditMode && <input type="hidden" name="productId" value={product.id} />}
          <input type="hidden" name="variants" value={JSON.stringify(variants.map(v => ({...v, options: v.options.map(o => ({...o, stock: o.stock === undefined ? null : o.stock}))})))} />
          <div className="space-y-4">
             <div>
                <Label htmlFor="title">Product Title</Label>
                <Input id="title" name="title" placeholder="e.g. Classic T-Shirt" defaultValue={product?.title} />
                {state.errors?.title && <p className="text-sm text-destructive mt-1">{state.errors.title[0]}</p>}
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" name="price" type="number" step="0.01" placeholder="e.g. 25.00" defaultValue={product?.price} />
                    {state.errors?.price && <p className="text-sm text-destructive mt-1">{state.errors.price[0]}</p>}
                </div>
                 <div>
                    <Label htmlFor="cost">Cost (for profit margin)</Label>
                    <Input id="cost" name="cost" type="number" step="0.01" placeholder="e.g. 10.00" defaultValue={product?.cost} />
                     {state.errors?.cost && <p className="text-sm text-destructive mt-1">{state.errors.cost[0]}</p>}
                </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <Label>Discount</Label>
                    <div className="flex gap-2">
                        <Input name="discountValue" type="number" step="0.01" placeholder="e.g. 5" defaultValue={product?.discount_value} />
                        <Select name="discountType" defaultValue={product?.discount_type || "percentage"}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="percentage">%</SelectItem>
                                <SelectItem value="amount">Amount</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                 </div>
                 <div>
                    <Label htmlFor="stock">Total Stock</Label>
                    <Input id="stock" name="stock" type="number" placeholder="e.g. 100" defaultValue={product?.stock} />
                     {state.errors?.stock && <p className="text-sm text-destructive mt-1">{state.errors.stock[0]}</p>}
                </div>
             </div>
                           <div>
                 <Label>Product Type</Label>
                 <Select name="productType" defaultValue={product?.product_type || "product"}>
                     <SelectTrigger>
                         <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                         <SelectItem value="product">Physical Product</SelectItem>
                         <SelectItem value="service">Service</SelectItem>
                     </SelectContent>
                 </Select>
                  {state.errors?.productType && <p className="text-sm text-destructive mt-1">{state.errors.productType[0]}</p>}
              </div>

              <div>
                 <Label>Images</Label>
                 <div className="mt-2">
                   {/* Debug: Log product images */}
                   {console.log('Product images:', product?.images)}
                   {/* UploadThing multiple uploads */}
                   <UploadImageField name="images" defaultUrls={product?.images || []} />
                 </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label>Variants</Label>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddVariant}>
                        <PlusCircle className="h-4 w-4 mr-2" /> Add Variant
                    </Button>
                </div>
                {variants.map((variant, vIndex) => (
                    <div key={vIndex} className="p-4 border rounded-lg space-y-3 bg-muted/50 relative">
                       <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => handleRemoveVariant(vIndex)}>
                           <X className="h-4 w-4" />
                        </Button>
                        <div>
                            <Label>Variant Type</Label>
                            <Input 
                                placeholder="e.g. Color, Size" 
                                value={variant.type}
                                onChange={(e) => handleVariantTypeChange(vIndex, e.target.value)}
                            />
                        </div>
                        <div>
                            <div className="grid grid-cols-3 gap-2 mb-1">
                                <Label className="col-span-2">Option Name</Label>
                                <Label>Stock (Optional)</Label>
                            </div>
                            <div className="space-y-2">
                                {variant.options.map((option, oIndex) => (
                                    <div key={oIndex} className="flex items-center gap-2">
                                        <Input 
                                            placeholder="e.g. Blue, XL"
                                            className="col-span-2"
                                            value={option.name}
                                            onChange={(e) => handleVariantOptionChange(vIndex, oIndex, 'name', e.target.value)}
                                        />
                                         <Input 
                                            type="number"
                                            placeholder="e.g. 50"
                                            value={option.stock ?? ''}
                                            onChange={(e) => handleVariantOptionChange(vIndex, oIndex, 'stock', e.target.value)}
                                        />
                                        <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveVariantOption(vIndex, oIndex)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <Button type="button" variant="link" size="sm" onClick={() => handleAddVariantOption(vIndex)} className="mt-2">
                                <PlusCircle className="h-4 w-4 mr-2" /> Add Option
                            </Button>
                        </div>
                    </div>
                ))}
                {state.errors?.variants && <p className="text-sm text-destructive mt-1">{state.errors.variants[0]}</p>}
             </div>
          </div>
          <DialogFooter>
             <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
             <SubmitButton isEditMode={isEditMode} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

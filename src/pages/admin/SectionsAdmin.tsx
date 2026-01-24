
import { useState, useEffect } from "react";
import { useSiteSettings, useUpdateSettings, HomepageSection } from "@/hooks/useSettings";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowUp, ArrowDown, Edit, Save, Trash2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const SectionsAdmin = () => {
    const navigate = useNavigate();
    const { data: settings, refetch } = useSiteSettings();
    const updateSettings = useUpdateSettings();
    const [sections, setSections] = useState<HomepageSection[]>([]);
    const [isDirty, setIsDirty] = useState(false);
    const [editingSection, setEditingSection] = useState<HomepageSection | null>(null);

    // Initialize sections from settings
    useEffect(() => {
        if (settings?.homepage_sections) {
            // Sort by order
            const sorted = [...settings.homepage_sections].sort((a, b) => a.order - b.order);
            setSections(sorted);
        }
    }, [settings]);

    const handleSave = async () => {
        if (!settings) return;

        try {
            // Ensure order is correct
            const updatedSections = sections.map((s, index) => ({
                ...s,
                order: index + 1
            }));

            await updateSettings.mutateAsync({
                ...settings,
                homepage_sections: updatedSections
            });
            setIsDirty(false);
            refetch(); // Ensure we have the latest version
        } catch (error) {
            toast.error("حدث خطأ أثناء الحفظ");
        }
    };

    const moveSection = (index: number, direction: 'up' | 'down') => {
        const newSections = [...sections];
        if (direction === 'up' && index > 0) {
            [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
        } else if (direction === 'down' && index < newSections.length - 1) {
            [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
        }
        setSections(newSections);
        setIsDirty(true);
    };

    const toggleSection = (id: string) => {
        setSections(sections.map(s =>
            s.id === id ? { ...s, isEnabled: !s.isEnabled } : s
        ));
        setIsDirty(true);
    };

    const updateSectionContent = (updatedSection: HomepageSection) => {
        setSections(sections.map(s => s.id === updatedSection.id ? updatedSection : s));
        setIsDirty(true);
        setEditingSection(null);
    };

    return (
        <div className="space-y-6 container mx-auto px-4 py-6 max-w-5xl">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowRight className="h-5 w-5" />
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">إدارة أقسام الصفحة الرئيسية</h2>
                        <p className="text-muted-foreground text-sm">سحب وإفلات لترتيب الأقسام، أو تعديل المحتوى</p>
                    </div>
                </div>
                <Button onClick={handleSave} disabled={!isDirty && !updateSettings.isPending} className="bg-primary text-white hover:bg-primary/90">
                    {updateSettings.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
                    <Save className="mr-2 h-4 w-4" />
                </Button>
            </div>

            <div className="grid gap-4">
                {sections.map((section, index) => (
                    <Card key={section.id} className={`transition-all duration-300 border hover:border-primary/50 ${!section.isEnabled ? 'opacity-60 bg-muted/30' : 'bg-white shadow-sm hover:shadow-md'}`}>
                        <CardContent className="p-4 flex items-center gap-4">
                            {/* Reorder Controls */}
                            <div className="flex flex-col gap-1 text-muted-foreground bg-muted/20 rounded-lg p-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 p-0 hover:bg-white hover:text-primary"
                                    onClick={() => moveSection(index, 'up')}
                                    disabled={index === 0}
                                >
                                    <ArrowUp className="h-3 w-3" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 p-0 hover:bg-white hover:text-primary"
                                    onClick={() => moveSection(index, 'down')}
                                    disabled={index === sections.length - 1}
                                >
                                    <ArrowDown className="h-3 w-3" />
                                </Button>
                            </div>

                            {/* Section Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="font-bold text-lg truncate">{section.title || section.type}</span>
                                    <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                        {section.type.replace('_', ' ')}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground truncate max-w-md">
                                    {section.subtitle || "لا يوجد وصف إضافي"}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 shrink-0">
                                {/* Delete Dialog */}
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>حذف القسم</DialogTitle>
                                            <DialogDescription>
                                                هل أنت متأكد من حذف هذا القسم؟ لا يمكن التراجع عن هذا الإجراء.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="flex justify-end gap-2 mt-4">
                                            <Button variant="ghost" onClick={() => { }}>إلغاء</Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() => {
                                                    const newSections = sections.filter(s => s.id !== section.id);
                                                    setSections(newSections);
                                                    setIsDirty(true);
                                                }}
                                            >
                                                حذف
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                {/* Edit Content Dialog */}
                                <Dialog open={editingSection?.id === section.id} onOpenChange={(open) => !open && setEditingSection(null)}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" onClick={() => setEditingSection(section)} className="gap-2">
                                            <Edit className="h-3 w-3" />
                                            <span className="hidden sm:inline">تعديل</span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>تعديل قسم: {section.title}</DialogTitle>
                                            <DialogDescription>
                                                قم بتعديل النصوص والمحتوى الخاص بهذا القسم
                                            </DialogDescription>
                                        </DialogHeader>

                                        <div className="space-y-6 py-4">
                                            <div className="grid gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="section-title">العنوان الرئيسي (Title)</Label>
                                                    <Input
                                                        id="section-title"
                                                        value={editingSection?.title || ''}
                                                        onChange={(e) => setEditingSection(prev => prev ? { ...prev, title: e.target.value } : null)}
                                                        placeholder="مثال: مميزاتنا"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="section-subtitle">الوصف / الرسالة (Subtitle)</Label>
                                                    <Textarea
                                                        id="section-subtitle"
                                                        value={editingSection?.subtitle || ''}
                                                        onChange={(e) => setEditingSection(prev => prev ? { ...prev, subtitle: e.target.value } : null)}
                                                        placeholder="هذا النص سيظهر تحت العنوان الرئيسي..."
                                                        rows={2}
                                                    />
                                                </div>
                                            </div>

                                            {/* Dynamic Content Fields based on Type */}
                                            <div className="rounded-lg border bg-muted/10 p-4">
                                                <Label className="mb-2 block font-semibold">إعدادات المحتوى</Label>

                                                {editingSection?.type === 'custom' ? (
                                                    <div className="space-y-4">
                                                        <div className="space-y-2">
                                                            <Label>صورة البانر</Label>
                                                            <Input
                                                                value={editingSection?.content?.image || ''}
                                                                onChange={(e) => setEditingSection(prev => prev ? {
                                                                    ...prev,
                                                                    content: { ...prev.content, image: e.target.value }
                                                                } : null)}
                                                                placeholder="/promo.jpg"
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-muted-foreground">JSON Metadata</Label>
                                                        <Textarea
                                                            className="font-mono text-xs bg-muted/20"
                                                            value={JSON.stringify(editingSection?.content || {}, null, 2)}
                                                            onChange={(e) => {
                                                                try {
                                                                    const content = JSON.parse(e.target.value);
                                                                    setEditingSection(prev => prev ? { ...prev, content } : null);
                                                                } catch (e) {
                                                                    // Ignore parse error while typing
                                                                }
                                                            }}
                                                            rows={5}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-2 sticky bottom-0 bg-background py-2 border-t mt-4">
                                            <Button variant="ghost" onClick={() => setEditingSection(null)}>إلغاء</Button>
                                            <Button onClick={() => editingSection && updateSectionContent(editingSection)}>حفظ وتطبيق</Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg">
                                    <Switch
                                        checked={section.isEnabled}
                                        onCheckedChange={() => toggleSection(section.id)}
                                        className="scale-90"
                                    />
                                    <span className={`text-xs font-semibold w-10 text-center ${section.isEnabled ? "text-green-600" : "text-muted-foreground"}`}>
                                        {section.isEnabled ? "ON" : "OFF"}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default SectionsAdmin;

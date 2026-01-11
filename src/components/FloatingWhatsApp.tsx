import { Phone } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSettings";

const FloatingWhatsApp = () => {
  const { data: settings } = useSiteSettings();
  const phoneNumber = settings?.store_phone || "01289006310";

  // Clean the phone number for the tel: link
  const cleanPhone = phoneNumber.replace(/[^0-9+]/g, "");

  return (
    <a
      href={`tel:${cleanPhone}`}
      className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 animate-bounce"
      aria-label="اتصل بنا"
    >
      <Phone className="h-6 w-6" />
    </a>
  );
};

export default FloatingWhatsApp;

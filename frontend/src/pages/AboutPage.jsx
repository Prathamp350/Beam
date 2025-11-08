import { useState } from "react";
import { Link } from "react-router";
import { ShipWheelIcon, ArrowLeftIcon, X, Send } from "lucide-react";
import toast from "react-hot-toast";

const NAVBAR_HEIGHT_PX = 64; // matches your navbar height (h-16)

const AboutPage = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ loading: false, success: null, error: null });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, error: null });

    try {
      const response = await fetch("https://formspree.io/f/mblqrdwg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus({ loading: false, success: "Message sent successfully!", error: null });
        setFormData({ name: "", email: "", message: "" });

        toast.success("Message sent successfully!", { duration: 3000 });
        // auto close after 2s
        setTimeout(() => setIsContactOpen(false), 2000);
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      setStatus({ loading: false, success: null, error: "Failed to send message. Please try again." });
      toast.error("Failed to send message. Try again later.", { duration: 3000 });
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn relative overflow-hidden">
      <div className="max-w-3xl text-center space-y-6">
        {/* Logo */}
        <div className="flex justify-center items-center gap-3">
          <ShipWheelIcon className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
            Beam
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-base-content/70 text-lg mt-2">
          Bridging cultures, connecting learners.
        </p>

        {/* Description */}
        <div className="bg-base-200 rounded-xl shadow-md p-6 text-left space-y-4 animate-slideUp">
          <p className="text-base text-base-content/80 leading-relaxed">
            <strong>Beam</strong> is a platform built to help language learners connect with
            partners across the globe. Whether you’re just beginning your journey or perfecting
            your fluency, Beam makes it easy to find friends, chat, and practice in real time.
          </p>

          <p className="text-base text-base-content/80 leading-relaxed">
            Our mission is to make language learning more personal, engaging, and fun by helping
            people build real connections — one conversation at a time.
          </p>

          <p className="text-base text-base-content/80 leading-relaxed">
            Developed with passion and precision, Beam focuses on simplicity, accessibility, and
            meaningful interaction. It’s more than an app — it’s a community of learners helping
            each other grow.
          </p>
        </div>

        {/* Buttons */}
        <div className="pt-4 animate-fadeIn delay-150 flex items-center justify-center gap-4">
          <Link to="/" className="btn btn-outline btn-primary flex items-center gap-2">
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Home
          </Link>

          <button onClick={() => setIsContactOpen(true)} className="btn btn-primary">
            Contact Us
          </button>
        </div>

        {/* Credits */}
        <div className="pt-6 text-sm opacity-70 animate-fadeIn delay-200">
          <p>
            Made with <span className="text-red-500">❤️</span> by{" "}
            <span className="font-semibold text-primary">Pratham & Kenil</span>.
          </p>
          <p>© {new Date().getFullYear()} Beam. All rights reserved.</p>
        </div>
      </div>

      {/* Contact Drawer (starts below navbar) */}
      {isContactOpen && (
        <>
          {/* Backdrop — starts below navbar so navbar remains visible */}
          <div
            className="fixed left-0 right-0 z-40 bg-black/40 backdrop-blur-sm"
            style={{
              top: `${NAVBAR_HEIGHT_PX}px`,
              bottom: 0,
            }}
            onClick={() => setIsContactOpen(false)}
          />

          {/* Drawer panel positioned under navbar */}
          <aside
            className="fixed right-0 z-50 bg-base-100 shadow-2xl p-6 flex flex-col transform transition-transform duration-300"
            style={{
              top: `${NAVBAR_HEIGHT_PX}px`,
              height: `calc(100vh - ${NAVBAR_HEIGHT_PX}px)`,
              width: "24rem", // 96 = 24rem
              // animation slide-in (you can keep your CSS keyframes or use inline)
              animation: "slideIn 0.32s ease-out forwards",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsContactOpen(false)}
              className="btn btn-ghost btn-sm absolute right-4"
              aria-label="Close contact drawer"
              style={{ top: "0.75rem" }}
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-semibold mb-2 text-primary mt-10">Contact Us</h2>
            <p className="text-sm text-base-content/70 mb-4">
              Have a question, suggestion, or just want to say hi? Send us a message and we'll get back to you.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 flex-1 overflow-auto">
              <input
                name="name"
                type="text"
                placeholder="Your name"
                className="input input-bordered w-full"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                name="email"
                type="email"
                placeholder="Your email"
                className="input input-bordered w-full"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <textarea
                name="message"
                placeholder="Your message"
                className="textarea textarea-bordered w-full h-32"
                value={formData.message}
                onChange={handleChange}
                required
              />

              <button type="submit" className="btn btn-primary w-full" disabled={status.loading}>
                {status.loading ? (
                  <>
                    <span className="loading loading-spinner loading-xs" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </button>

              {status.success && <p className="text-success text-sm">{status.success}</p>}
              {status.error && <p className="text-error text-sm">{status.error}</p>}
            </form>

            <div className="mt-4 text-xs opacity-70">
              <p>We aim to reply within 48 hours.</p>
            </div>
          </aside>
        </>
      )}
    </div>
  );
};

export default AboutPage;

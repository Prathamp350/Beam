import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="w-full  border-base-300 bg-base-100 text-center py-3 text-sm text-base-content/70">
      Learn more about{" "}
      <Link to="/about" className="text-primary font-semibold hover:underline">
        Beam.
      </Link>
    </footer>
  );
};

export default Footer;

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
// import currentRepo from '@/public/common';

const Footer = () => {
  return (
    <footer className="bg-gray-700 text-white py-4">
      <div className="container mx-auto flex justify-between items-end px-6">
        <div className="flex items-center justify-center space-x-6">
          <a
            href={`https://github.com/evbxll/PhysicsSim`}
            target='_blank'
            rel="noopener noreferrer"
            className="text-white hover:text-gray-300 transition-colors duration-300 flex items-center"
          >
            <FontAwesomeIcon icon={faGithub} className="h-6 w-6" />
          </a>
          <div className="text-gray-400 text-2xl font-bold">|</div>
          <a
            href="https://evbxll.github.io/"
            target='_blank'
            rel="noopener noreferrer"
            className="text-custom-yellow hover:text-custom-yellow-dark transition-colors duration-300 text-lg font-bold"
          >
            Homepage (and other projects)
          </a>
        </div>
        <p>&copy; {new Date().getFullYear()} Evan Bell (evbxll). All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

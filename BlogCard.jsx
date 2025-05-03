import React from 'react';

const BlogCard = ({ bimg, bdate, btitle, bdesc }) => {
  return (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
      {/* Image */}
      <div className="relative h-48 sm:h-64 md:h-72 lg:h-80 overflow-hidden">
        <img
          src={bimg}
          alt={btitle}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="text-gray-500 text-sm mb-3">{bdate}</div>
        <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-teal-400">{btitle}</h3>
        <p className="text-gray-600">{bdesc}</p>
      </div>
    </div>
  );
}

export default BlogCard;

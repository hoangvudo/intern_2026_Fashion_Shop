const products = [
  {
    name: "Silk Evening Gown",
    collection: "Couture Collection",
    percent: 82,
    width: "82%",
  },
  {
    name: "Velvet Tuxedo Blazer",
    collection: "Formal Wear",
    percent: 64,
    width: "64%",
  },
  {
    name: "Linen Summer Shirt",
    collection: "Seasonal Essentials",
    percent: 48,
    width: "48%",
  },
  {
    name: "Cashmere Scarf",
    collection: "Accessories",
    percent: 35,
    width: "35%",
  },
];

function BestSellers() {
  return (
    <div className="flex flex-col gap-6 border border-[#D1C4B9] bg-white p-8">
      <p className="font-beVietnamPro text-base text-[#1B1C19]">
        Sản phẩm bán chạy
      </p>
      <div className="flex flex-col gap-6">
        {products.map((product) => (
          <div key={product.name} className="flex flex-col gap-2">
            <div className="flex items-end justify-between">
              <div>
                <p className="font-beVietnamPro text-base text-[#1B1C19]">
                  {product.name}
                </p>
                <p className="font-beVietnamPro text-base text-[#4E453D] opacity-60">
                  {product.collection}
                </p>
              </div>
              <p className="font-beVietnamPro text-base text-[#6F583D]">
                {product.percent}%
              </p>
            </div>
            <div className="h-1.5 w-full bg-[#F0EEE9]">
              <div
                className="h-full bg-[#6F583D]"
                style={{ width: product.width }}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="w-full border border-[#D1C4B9] py-3 font-beVietnamPro text-base text-[#1B1C19] transition-colors hover:bg-[#F0EEE9]"
      >
        Xem tất cả báo cáo
      </button>
    </div>
  );
}

export default BestSellers;

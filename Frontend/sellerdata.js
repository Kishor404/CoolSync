export let SellerData = { Product: {}, Driver: {}, DriverUser: {}, Device: {}  };

export const setSellerData = (value) => {
  SellerData = {
    Product: value.Product !== undefined ? value.Product : SellerData.Product,
    Driver: value.Driver !== undefined ? value.Driver : SellerData.Driver,
    DriverUser: value.DriverUser !== undefined ? value.DriverUser : SellerData.DriverUser,
    Device: value.Device !== undefined ? value.Device : SellerData.Device,
  };
};

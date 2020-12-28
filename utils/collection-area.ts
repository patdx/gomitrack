export interface CollectionArea {
  _id: string;
  addressJP: string;
  address: string;
  zipcode: string;
  lat: number;
  lng: number;
}

export const formatZip = (address: CollectionArea) => {
  // adds the dash "1550000" --> "155-0000"
  return address.zipcode.slice(0, 3) + '-' + address.zipcode.slice(3);
};

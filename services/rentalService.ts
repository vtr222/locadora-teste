export interface Rental {
  id: number;
  client: number;
  movies: string[];
  rentalDate: string;
  returnDate: string | null;
  userId: number;
  status: "rented" | "returned";

  clientName: string;
  movieNames: string;
  userName: string;
}

export const getRentals = (
  clientName?: string,
  rentalDate?: string,
  returnDate?: string
): Rental[] => {
  const allRentals: Rental[] = JSON.parse(
    localStorage.getItem("rentals") || "[]"
  );

  //alguma bobagem que eu fiz em algum ponto salvou o rental como rental.rental, verificar depois
  return allRentals.filter((rental: any) => {
    let matchesClientName =
      !clientName ||
      rental.rental.clientName.toLowerCase().includes(clientName.toLowerCase());
    let matchesRentalDate =
      !rentalDate || rental.rental.rentalDate === rentalDate;
    let matchesReturnDate =
      !returnDate || rental.rental.returnDate === returnDate;

    return matchesClientName && matchesRentalDate && matchesReturnDate;
  });
};

const saveRentals = (rentals: Rental[]): void => {
  localStorage.setItem("rentals", JSON.stringify(rentals));
};

export const getDefaultRental = () => {
  return {
    id: 1,
    client: 1,
    movies: [],
    rentalDate: "",
    returnDate: "",
    userId: 1,
    status: "rented",
    clientName: "",
    movieNames: "",
    userName: "",
  } as Rental;
};

export const createRental = (rental: Rental): void => {
  const rentals = getRentals();
  rental.id = Date.now();
  rentals.push(rental);
  saveRentals(rentals);
};

export const getRentalById = (id: number): Rental | undefined => {
  try {
    const rentals = getRentals();
    return rentals.find((rental) => rental.id === id);
  } catch (e) {
    console.error(e);
  }
};

export const updateRental = (updatedRental: Rental): void => {
  let rentals = getRentals();
  rentals = rentals.map((rental) =>
    rental.id === updatedRental.id ? updatedRental : rental
  );
  saveRentals(rentals);
};

export const rentalService = {
  createRental,
  getRentalById,
  updateRental,
  getRentals,
};

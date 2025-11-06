import { ProfileMenu } from '../ProfileMenu';
import { CartIcon } from '../../../../features/cart';
import { SearchBar } from '../../../../features/search';
import { useSearchStore } from '../../../../app/store';
import { BalanceWidget } from '../../../../features/cart/components/BalanceWidget/BalanceWidget';

export const NavBar = () => {
  const { setSearchTerm } = useSearchStore();

  return (
    <nav className="text-white font-bold whitespace-nowrap">
      <div className="bg-lime-400 flex items-center h-16 pr-4">
        <div className="flex items-center space-x-3 bg-lime-500 p-2 rounded-br-xl">
          <img src="/icon.png" alt="[Icono]" className="w-12 h-12" />
          <h1 className="text-5xl">MERCADO LIBREST</h1>
        </div>
        <div className="flex-1 ml-4">
          <SearchBar onSearch={setSearchTerm} />
        </div>
        <div className="ml-auto flex items-center space-x-5">
          <BalanceWidget />
          <CartIcon />
          <ProfileMenu /> {/* ✅ Quitar props innecesarias */}
        </div>
      </div>

      <ul className="flex space-x-10 text-2xl bg-lime-300 p-2 justify-center text-white rounded-b-2xl">
        <li className="hover:underline cursor-pointer">Categorías</li>
        <li className="hover:underline cursor-pointer">Ofertas</li>
        <li className="hover:underline cursor-pointer">Productos</li>
        <li className="hover:underline cursor-pointer">Vender</li>
        <li className="hover:underline cursor-pointer">Ayuda</li>
      </ul>
    </nav>
  );
};
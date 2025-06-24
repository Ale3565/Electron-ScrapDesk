// Componente A1 - Panel ACM
const ComponenteA1 = () => {
  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="p-8">
        <div>
          <h2 className="text-2xl mb-4">ACM Panel</h2>
          <input type="text" placeholder="Ingrese su texto" className="border p-2 mb-4 w-full" />
          <input type="number" placeholder="Ingrese un número" className="border p-2 mb-4 w-full" />
        </div>
      </div>
    </div>
  );
};

export default ComponenteA1;

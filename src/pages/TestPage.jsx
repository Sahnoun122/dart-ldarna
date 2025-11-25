import Navbar from "../components/Navbar";

export default function TestPage() {
  return (
    <>
      <Navbar />
      <div style={{ padding: '20px', backgroundColor: 'lightblue' }}>
        <h1 style={{ color: 'red' }}>Test Page</h1>
        <p>Si vous voyez cette page, React fonctionne correctement.</p>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '10px', 
          margin: '10px 0',
          border: '1px solid black'
        }}>
          <p>Test du CSS inline</p>
        </div>
      </div>
    </>
  );
}
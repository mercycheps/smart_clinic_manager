import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 4rem)' }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">MedHub Dashboard</h1>
          <p className="text-xl text-muted-foreground mb-8">Medical Management System</p>
          <div className="space-y-4">
            <Link to="/doctor">
              <Button className="w-full max-w-xs">
                Go to Doctor Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

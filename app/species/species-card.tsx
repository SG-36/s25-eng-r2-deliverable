"use client";
/*
Note: "use client" is a Next.js App Router directive that tells React to render the component as
a client component rather than a server component. This establishes the server-client boundary,
providing access to client-side functionality such as hooks and event handlers to this component and
any of its imported children. Although the SpeciesCard component itself does not use any client-side
functionality, it is beneficial to move it to the client because it is rendered in a list with a unique
key prop in species/page.tsx. When multiple component instances are rendered from a list, React uses the unique key prop
on the client-side to correctly match component state and props should the order of the list ever change.
React server components don't track state between rerenders, so leaving the uniquely identified components (e.g. SpeciesCard)
can cause errors with matching props and state in child components if the list order changes.
*/
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Database } from "@/lib/schema";
import Image from "next/image";
import { useState } from "react";
import EditSpeciesDialog from "./edit-species-dialog";

type Species = Database["public"]["Tables"]["species"]["Row"];

export default function SpeciesCard({ species, userId }: { species: Species; userId: string }) {
  const [open, setOpen] = useState(false);

  console.log('Author:', species.author);
  console.log('UserId:', userId);

  return (
    <div className="m-4 w-72 min-w-72 flex-none rounded border-2 p-3 shadow">
      {species.image && (
        <div className="relative h-40 w-full">
          <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover" }} />
        </div>
      )}
      <h3 className="mt-3 text-2xl font-semibold">{species.scientific_name}</h3>
      <h4 className="text-lg font-light italic">{species.common_name}</h4>
      <p>{species.description ? species.description.slice(0, 150).trim() + "..." : ""}</p>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mt-3 w-full">Learn More</Button>
        </DialogTrigger>
        <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">{species.scientific_name}</DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            {species.scientific_name && (
              <div>
                <h4 className="font-semibold">Scientific Name</h4>
                <p className="text-gray-700">{species.scientific_name}</p>
              </div>
            )}
            {species.common_name && (
              <div>
                <h4 className="font-semibold">Common Name</h4>
                <p className="text-gray-700">{species.common_name}</p>
              </div>
            )}

            <div>
              <h4 className="font-semibold">Kingdom</h4>
              <p className="text-gray-700">{species.kingdom}</p>
            </div>

            {species.total_population && (
              <div>
                <h4 className="font-semibold">Total Population</h4>
                <p className="text-gray-700">{species.total_population.toLocaleString()}</p>
              </div>
            )}

            {species.description && (
              <div>
                <h4 className="font-semibold">Description</h4>
                <p className="text-gray-700">{species.description}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {/* Button to only be shown if the user created this species */}
      {species.author === userId && (
        <EditSpeciesDialog species={species} />

      )}
    </div>
  );
}

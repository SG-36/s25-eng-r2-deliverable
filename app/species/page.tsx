import { Separator } from "@/components/ui/separator";
import { TypographyH2 } from "@/components/ui/typography";
import { createServerSupabaseClient } from "@/lib/server-utils";
import { redirect } from "next/navigation";
import AddSpeciesDialog from "./add-species-dialog";
import SearchSpecies from "./search-species";
import SpeciesCard from "./species-card";

export default async function SpeciesList({
  searchParams,
}: {
  searchParams: { query: string };
}) {
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/");
  }

  const sessionId = session.user.id;
  const { data: species } = await supabase.from("species").select("*").order("id", { ascending: false });

  // Filter species based on search query
  const filteredSpecies = species?.filter((species) => {
    if (!searchParams.query) return true;

    const query = searchParams.query.toLowerCase();
    return (
      species.scientific_name.toLowerCase().includes(query) ||
      (species.common_name?.toLowerCase().includes(query) ?? false) ||
      (species.description?.toLowerCase().includes(query) ?? false)
    );
  });

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <TypographyH2>Species List</TypographyH2>
        <div className="flex gap-4">
          <SearchSpecies />
          <AddSpeciesDialog userId={sessionId} />
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex flex-wrap justify-center">
        {filteredSpecies?.map((species) => (
          <SpeciesCard key={species.id} species={species} userId={sessionId} />
        ))}
      </div>
    </>
  );
}

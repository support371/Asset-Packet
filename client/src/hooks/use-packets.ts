import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { Packet, PacketWithSections } from "@shared/schema";

// GET /api/packets - List all packets
export function usePackets() {
  return useQuery({
    queryKey: [api.packets.list.path],
    queryFn: async () => {
      const res = await fetch(api.packets.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch packets");
      return api.packets.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/packets/:id - Get single packet with sections
export function usePacket(id: number) {
  return useQuery({
    queryKey: [api.packets.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.packets.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch packet details");
      
      return api.packets.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

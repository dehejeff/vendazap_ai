"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const nicheOptions = [
  "Motopeças",
  "Autopeças",
  "Lojas de celular",
  "Material de construção",
  "Informática",
  "Outro",
] as const;

type StoreOnboardingFormProps = {
  initialNiche?: string;
  initialPhone?: string;
  initialStoreName: string;
  initialWhatsappNumber?: string;
};

type SubmitState = "idle" | "submitting" | "success" | "error";

function formatBrazilPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) {
    return digits ? `(${digits}` : "";
  }

  if (digits.length <= 3) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function StoreOnboardingForm({
  initialNiche = "",
  initialPhone = "",
  initialStoreName,
  initialWhatsappNumber = "",
}: StoreOnboardingFormProps) {
  const router = useRouter();
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState(() => formatBrazilPhone(initialPhone));
  const [whatsappNumber, setWhatsappNumber] = useState(() =>
    formatBrazilPhone(initialWhatsappNumber),
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload = {
      niche: String(formData.get("niche") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      storeName: String(formData.get("storeName") ?? "").trim(),
      whatsappNumber: String(formData.get("whatsappNumber") ?? "").trim(),
    };

    setSubmitState("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/store/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message || "Não foi possível salvar a loja.");
      }

      setSubmitState("success");
      setMessage("Dados da loja salvos. A base do onboarding inicial já está pronta.");
      router.refresh();
    } catch (error) {
      setSubmitState("error");
      setMessage(
        error instanceof Error ? error.message : "Não foi possível salvar a loja.",
      );
    } finally {
      setSubmitState((current) => (current === "error" ? current : "idle"));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          name="storeName"
          type="text"
          required
          defaultValue={initialStoreName}
          placeholder="Nome da loja"
          className="w-full rounded-xl border border-[#bacbbc]/30 bg-white px-4 py-3 text-sm text-[#191c1d] outline-none placeholder:text-[#6b7b6e]"
        />

        <div className="rounded-xl border border-[#bacbbc]/30 bg-white px-4 py-3 text-sm text-[#191c1d]">
          <select
            name="niche"
            required
            defaultValue={initialNiche}
            className="w-full bg-transparent text-sm text-[#191c1d] outline-none"
          >
            <option value="" disabled>
              Selecione o nicho
            </option>
            {nicheOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <input
          name="phone"
          type="text"
          inputMode="numeric"
          value={phone}
          onChange={(event) => setPhone(formatBrazilPhone(event.target.value))}
          placeholder="Telefone da loja"
          className="w-full rounded-xl border border-[#bacbbc]/30 bg-white px-4 py-3 text-sm text-[#191c1d] outline-none placeholder:text-[#6b7b6e]"
        />

        <input
          name="whatsappNumber"
          type="text"
          inputMode="numeric"
          value={whatsappNumber}
          onChange={(event) =>
            setWhatsappNumber(formatBrazilPhone(event.target.value))
          }
          placeholder="WhatsApp principal"
          className="w-full rounded-xl border border-[#bacbbc]/30 bg-white px-4 py-3 text-sm text-[#191c1d] outline-none placeholder:text-[#6b7b6e]"
        />
      </div>

      <button
        type="submit"
        disabled={submitState === "submitting"}
        className="w-full rounded-xl bg-[#006d3e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#005931] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {submitState === "submitting" ? "Salvando..." : "Salvar onboarding inicial"}
      </button>

      {message ? (
        <p
          className={`text-sm ${
            submitState === "error" ? "text-red-500" : "text-[#2d8a4b]"
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}

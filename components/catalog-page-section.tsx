"use client";

import { Fragment, useMemo, useState } from "react";
import { CatalogWorkspace } from "@/components/catalog-workspace";
import { ProductForm } from "@/components/product-form";
import { ProductStockForm } from "@/components/product-stock-form";
import { StoreOnboardingForm } from "@/components/store-onboarding-form";
import type { StoredProduct } from "@/lib/products";

type CatalogPageSectionProps = {
  activeProductsCount: number;
  currentUser: {
    niche?: string;
    phone?: string;
    storeName: string;
    whatsappNumber?: string;
  } | null;
  onboardingCompleted: boolean;
  products: StoredProduct[];
  sessionStoreName: string;
};

export function CatalogPageSection({
  activeProductsCount,
  currentUser,
  onboardingCompleted,
  products,
  sessionStoreName,
}: CatalogPageSectionProps) {
  const [desktopSearch, setDesktopSearch] = useState("");
  const [expandedDesktopProductIds, setExpandedDesktopProductIds] = useState<
    string[]
  >([]);

  function normalizeText(value: string) {
    return value
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();
  }

  const filteredDesktopProducts = useMemo(() => {
    const normalizedSearch = normalizeText(desktopSearch.trim());

    if (!normalizedSearch) {
      return products;
    }

    return products.filter((product) => {
      const haystack = normalizeText(
        [
          product.name,
          product.category,
          product.compatibility ?? "",
          product.sku ?? "",
          product.description,
        ].join(" "),
      );

      return haystack.includes(normalizedSearch);
    });
  }, [desktopSearch, products]);

  const categories = Array.from(
    new Set(products.map((product) => product.category).filter(Boolean)),
  ).slice(0, 6);

  function toggleDesktopProduct(productId: string) {
    setExpandedDesktopProductIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  }

  return (
    <div className="space-y-6 md:space-y-5">
      <section className="flex flex-col gap-4 md:hidden">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-[1.6rem] font-bold tracking-[-0.03em] text-[#191c1d]">
              Gestão de catálogo
            </h1>
            <p className="mt-1 text-sm leading-6 text-[#3c4a3f]">
              Cadastre, organize e ajuste os produtos que a IA vai usar nas respostas.
            </p>
          </div>
          <div className="hidden rounded-xl bg-[#006d3e] px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_8px_20px_rgba(0,0,0,0.08)] md:block">
            {activeProductsCount} produto(s) ativo(s)
          </div>
          <a
            href="#novo-produto"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#006d3e] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition active:scale-95 md:hidden"
          >
            <span className="text-base leading-none">+</span>
            Cadastrar novo produto
          </a>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 md:hidden">
          <span className="whitespace-nowrap rounded-full bg-[#006d3e] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-white">
            Todos
          </span>
          {categories.length > 0 ? (
            categories.map((category) => (
              <span
                key={category}
                className="whitespace-nowrap rounded-full bg-[#e6e8e9] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#3c4a3f]"
              >
                {category}
              </span>
            ))
          ) : (
            <span className="whitespace-nowrap rounded-full bg-[#e6e8e9] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#3c4a3f]">
              Catálogo em montagem
            </span>
          )}
        </div>
      </section>

      <section className="hidden gap-4 xl:grid xl:grid-cols-[1.05fr_0.95fr]">
        <div className="dashboard-card rounded-xl border border-[#bacbbc]/30 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#006d3e]">
                Onboarding da loja
              </p>
              <h2 className="mt-1 text-lg font-bold text-[#191c1d]">
                Base da operação
              </h2>
            </div>
            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${onboardingCompleted ? "bg-[#00d981]/12 text-[#005931]" : "bg-[#fff3e0] text-[#e65100]"}`}>
              {onboardingCompleted ? "Concluído" : "Pendente"}
            </span>
          </div>
          <StoreOnboardingForm
            initialStoreName={currentUser?.storeName ?? sessionStoreName}
            initialNiche={currentUser?.niche}
            initialPhone={currentUser?.phone}
            initialWhatsappNumber={currentUser?.whatsappNumber}
          />
        </div>

        <div className="dashboard-card rounded-xl border border-[#bacbbc]/30 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#006d3e]">
                Novo produto
              </p>
              <h2 className="mt-1 text-lg font-bold text-[#191c1d]">
                Cadastro rápido
              </h2>
            </div>
            <span className="rounded-full bg-[#edf9ff] px-3 py-1 text-[11px] font-semibold text-[#00668a]">
              Manual
            </span>
          </div>
          <ProductForm />
        </div>
      </section>

      <section className="dashboard-card rounded-xl border border-[#bacbbc]/30 p-5 md:hidden">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#006d3e]">
              Novo produto
            </p>
            <h2 id="novo-produto" className="mt-1 text-lg font-bold text-[#191c1d]">
              Cadastro rápido
            </h2>
          </div>
          <span className="rounded-full bg-[#edf9ff] px-3 py-1 text-[11px] font-semibold text-[#00668a]">
            Manual
          </span>
        </div>
        <ProductForm />
      </section>

      <section className="hidden space-y-6 md:block">
        <section className="grid grid-cols-12 gap-6">
          <div className="col-span-4 rounded-2xl border border-[#bbcbb9]/20 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#25d366]/15 text-[#006d2f]">
                <span className="text-2xl">▣</span>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6c7b6b]">
                  Total de Produtos
                </p>
                <h3 className="mt-1 text-3xl font-bold tracking-[-0.03em] text-[#111c2d]">
                  {products.length}
                </h3>
                <p className="mt-1 text-xs font-semibold text-[#006d2f]">
                  +12% este mês
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-4 rounded-2xl border border-[#bbcbb9]/20 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffdad6]/40 text-[#ba1a1a]">
                <span className="text-2xl">!</span>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6c7b6b]">
                  Estoque Baixo
                </p>
                <h3 className="mt-1 text-3xl font-bold tracking-[-0.03em] text-[#111c2d]">
                  {products.filter((product) => product.stockQuantity <= 3).length}
                </h3>
                <p className="mt-1 text-xs font-semibold text-[#ba1a1a]">
                  Precisa de atenção
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-4 flex items-center justify-between rounded-2xl bg-[#006d2f] p-6 text-white shadow-md">
            <div>
              <h4 className="text-xl font-semibold">Expanda sua loja</h4>
              <p className="mt-2 text-sm text-white/80">
                Otimize suas vendas com IA em todos os produtos.
              </p>
            </div>
            <span className="text-5xl opacity-20">✦</span>
          </div>
        </section>

        <section className="rounded-2xl border border-[#bbcbb9]/20 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-2xl flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6c7b6b]">⌕</span>
              <input
                type="text"
                value={desktopSearch}
                onChange={(event) => setDesktopSearch(event.target.value)}
                placeholder="Buscar por nome, SKU ou categoria..."
                className="h-12 w-full rounded-xl border border-[#bbcbb9]/30 bg-[#f0f3ff] pl-12 pr-4 text-sm text-[#111c2d] outline-none"
              />
            </div>

            <button className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#006d2f] px-5 text-sm font-bold text-white shadow-md transition hover:opacity-95">
              <span className="text-lg">+</span>
              Novo Produto
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="whitespace-nowrap rounded-full bg-[#006d2f] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-white">
              Todos
            </span>
            {categories.map((category) => (
              <span
                key={category}
                className="whitespace-nowrap rounded-full bg-[#dee8ff] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#3c4a3d]"
              >
                {category}
              </span>
            ))}
            <span className="ml-auto whitespace-nowrap px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#6c7b6b]">
              Filtros Avançados
            </span>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#bbcbb9]/20 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#bbcbb9]/20 bg-[#f0f3ff]/60">
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6c7b6b]">Produto</th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6c7b6b]">SKU</th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6c7b6b]">Categoria</th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6c7b6b]">Preço</th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6c7b6b]">Estoque</th>
                  <th className="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6c7b6b]">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#bbcbb9]/15">
                {filteredDesktopProducts.map((product) => {
                  const isExpanded = expandedDesktopProductIds.includes(product.id);

                  return (
                    <Fragment key={product.id}>
                      <tr key={product.id} className="group hover:bg-[#f9f9ff]">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e7eeff] font-bold text-[#006d2f]">
                              {product.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[#111c2d]">{product.name}</p>
                              <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-[#006d2f]">
                                ✦ {product.compatibility ? "IA Otimizado" : "Manual"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#6c7b6b]">{product.sku || "Sem SKU"}</td>
                        <td className="px-6 py-4 text-sm text-[#111c2d]">{product.category}</td>
                        <td className="px-6 py-4 text-sm font-bold text-[#111c2d]">
                          R$ {product.price.toFixed(2).replace(".", ",")}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm text-[#111c2d]">{product.stockQuantity} un.</span>
                            <span className={`text-[10px] font-bold uppercase tracking-[0.06em] ${product.stockQuantity <= 3 ? "text-[#ba1a1a]" : "text-[#006d2f]"}`}>
                              {product.stockQuantity <= 3 ? "Estoque baixo" : "Estoque OK"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => toggleDesktopProduct(product.id)}
                              className="rounded-lg bg-[#dee8ff] px-3 py-2 text-xs font-semibold text-[#3c4a3d] transition hover:bg-[#d8e3fb]"
                            >
                              {isExpanded ? "Fechar" : "Editar"}
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleDesktopProduct(product.id)}
                              className="rounded-full p-2 text-[#6c7b6b] transition hover:bg-[#dee8ff]"
                            >
                              {isExpanded ? "−" : "⋮"}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded ? (
                        <tr className="bg-[#f9fbff]">
                          <td colSpan={6} className="px-6 py-5">
                            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                              <div className="rounded-2xl border border-[#bbcbb9]/20 bg-white p-4">
                                <p className="text-sm font-semibold text-[#111c2d]">
                                  Ajustes rápidos do produto
                                </p>
                                <p className="mt-2 text-sm leading-6 text-[#5f6f67]">
                                  Edite preço, estoque e status sem sair da tabela. Ideal para correções rápidas no dia a dia da operação.
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                  <span className="rounded-full bg-[#edf9ff] px-3 py-1 text-[11px] font-semibold text-[#00668a]">
                                    {product.category}
                                  </span>
                                  {product.compatibility ? (
                                    <span className="rounded-full bg-[#eefaf0] px-3 py-1 text-[11px] font-semibold text-[#2d8a4b]">
                                      {product.compatibility}
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                              <div className="rounded-2xl border border-[#bbcbb9]/20 bg-white p-4">
                                <ProductStockForm
                                  productId={product.id}
                                  initialActive={product.active}
                                  initialPrice={product.price}
                                  initialStockQuantity={product.stockQuantity}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-[#bbcbb9]/20 bg-[#f0f3ff]/50 px-6 py-4">
            <p className="text-xs font-semibold text-[#6c7b6b]">
              Exibindo {filteredDesktopProducts.length} produto(s) no catálogo
            </p>
            <div className="flex items-center gap-2">
              <button className="rounded-full p-2 text-[#6c7b6b] transition hover:bg-[#dee8ff]">‹</button>
              <span className="rounded-lg bg-[#25d366]/20 px-3 py-1 text-xs font-semibold text-[#005523]">1</span>
              <button className="rounded-full p-2 text-[#6c7b6b] transition hover:bg-[#dee8ff]">›</button>
            </div>
          </div>
        </section>
      </section>

      <section className="dashboard-card rounded-xl border border-[#bacbbc]/30 p-5 md:hidden">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#191c1d]">Produtos cadastrados</h2>
            <p className="mt-1 text-sm leading-6 text-[#3c4a3f]">
              Edite preço, estoque e status sem sair da tela.
            </p>
          </div>
          <span className="rounded-full bg-[#f2f4f5] px-3 py-1 text-[11px] font-semibold text-[#3c4a3f]">
            {products.length} item(ns)
          </span>
        </div>

        <CatalogWorkspace products={products} />
      </section>
    </div>
  );
}

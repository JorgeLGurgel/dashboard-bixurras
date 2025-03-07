"use client"
import React, { useState, useEffect } from 'react';

const BixurrasDashboard2 = () => {
  // Estados para valores dinâmicos
  const [integrantes, setIntegrantes] = useState(32);
  const [valorMensal, setValorMensal] = useState(15);
  const [valorEntrada, setValorEntrada] = useState(50);
  const [rifasPorIntegrante, setRifasPorIntegrante] = useState(150);
  const [valorRifa, setValorRifa] = useState(3);
  const [premiacoes, setPremiacoes] = useState(2600);
  const [valorBixurras, setValorBixurras] = useState(14794);
  
  // Estados para valores calculados
  const [valorAteBixurras, setValorAteBixurras] = useState(0);
  const [rifasTotais, setRifasTotais] = useState(0);
  const [faturamentoRifa, setFaturamentoRifa] = useState(0);
  const [lucroRifa, setLucroRifa] = useState(0);
  const [valorAlcancado, setValorAlcancado] = useState(0);
  const [valorFaltante, setValorFaltante] = useState(0);
  const [excedente, setExcedente] = useState(0);
  const [metaAtingida, setMetaAtingida] = useState(false);
  
  // Estado para tab ativa
  const [activeTab, setActiveTab] = useState('resumo');
  
  // Calcular todos os valores derivados
  useEffect(() => {
    // Cálculo do valor até o bixurras (entrada + 4 parcelas mensais)
    const calculoValorAteBixurras = (valorEntrada * integrantes) + (valorMensal * 4 * integrantes);
    setValorAteBixurras(calculoValorAteBixurras);
    
    // Cálculo das rifas
    const calculoRifasTotais = integrantes * rifasPorIntegrante;
    setRifasTotais(calculoRifasTotais);
    
    const calculoFaturamentoRifa = calculoRifasTotais * valorRifa;
    setFaturamentoRifa(calculoFaturamentoRifa);
    
    const calculoLucroRifa = calculoFaturamentoRifa - premiacoes;
    setLucroRifa(calculoLucroRifa);
    
    // Cálculo do valor total alcançado
    const calculoValorAlcancado = calculoValorAteBixurras + calculoLucroRifa;
    setValorAlcancado(calculoValorAlcancado);
    
    // Verificação se meta foi atingida
    const atingiuMeta = calculoValorAlcancado >= valorBixurras;
    setMetaAtingida(atingiuMeta);
    
    if (atingiuMeta) {
      setExcedente(calculoValorAlcancado - valorBixurras);
      setValorFaltante(0);
    } else {
      setExcedente(0);
      setValorFaltante(valorBixurras - calculoValorAlcancado);
    }
    
  }, [integrantes, valorMensal, valorEntrada, rifasPorIntegrante, valorRifa, premiacoes, valorBixurras]);
  
  // Formatação de valores monetários
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Componente de Card
  const Card = ({ title, value, color }) => {
    return (
      <div className="bg-white rounded-lg shadow p-4 flex flex-col border border-purple-900">
        <h3 className="text-sm text-black font-medium">{title}</h3>
        <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
      </div>
    );
  };
  
  const InputField = ({ label, value, onChange, type = "number", min = "0", step = "1" }) => {
    const [localValue, setLocalValue] = React.useState(value.toString()); // Valor como string para digitação
  
    // Sincroniza o valor local com o valor externo quando ele muda
    React.useEffect(() => {
      setLocalValue(value.toString());
    }, [value]);
  
    const handleChange = (e) => {
      const newValue = e.target.value;
      setLocalValue(newValue); // Atualiza o valor local enquanto digita
    };
  
    const handleBlur = (e) => {
      const numericValue = Number(e.target.value);
      const finalValue = isNaN(numericValue) || e.target.value === "" ? 0 : numericValue;
      onChange(finalValue); // Atualiza o pai com o número final ao sair do campo
      setLocalValue(finalValue.toString()); // Sincroniza o local com o valor final
    };
  
    return (
      <div className="mb-3">
        <label className="block text-sm font-medium text-black mb-1">{label}</label>
        <input
          type={type}
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-black font-medium"
          min={min}
          step={step}
        />
      </div>
    );
  };
  
  // Componente de Tab
  const Tab = ({ id, label, active, onClick }) => {
    return (
      <button
        onClick={() => onClick(id)}
        className={`px-4 py-2 font-medium rounded-t-lg ${
          active 
            ? 'bg-purple-900 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-purple-900 hover:text-white'
        }`}
      >
        {label}
      </button>
    );
  };
  
  return (
    <div className="bg-gray-100 p-6 rounded-lg max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-purple-900 mb-2">Dashboard Financeiro - Bixurras</h1>
        <p className="text-gray-600">Visão geral do planejamento financeiro do evento</p>
      </div>
      
      {/* Valores principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card 
          title="Valor do Bixurras" 
          value={formatCurrency(valorBixurras)}
          color="text-purple-900" 
        />
        <Card 
          title="Valor Alcançado" 
          value={formatCurrency(valorAlcancado)}
          color={metaAtingida ? "text-green-600" : "text-yellow-600"} 
        />
        {metaAtingida ? (
          <Card 
            title="Excedente" 
            value={formatCurrency(excedente)}
            color="text-purple-900" 
          />
        ) : (
          <Card 
            title="Valor Faltante" 
            value={formatCurrency(valorFaltante)}
            color="text-red-600" 
          />
        )}
        <Card 
          title="Status" 
          value={metaAtingida ? "Meta Atingida! 🎉" : "Em andamento..."}
          color={metaAtingida ? "text-green-600" : "text-yellow-600"} 
        />
      </div>
      
      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-2 border-b border-gray-300">
          <Tab 
            id="resumo" 
            label="Resumo" 
            active={activeTab === 'resumo'} 
            onClick={setActiveTab} 
          />
          <Tab 
            id="mensalidades" 
            label="Mensalidades" 
            active={activeTab === 'mensalidades'} 
            onClick={setActiveTab} 
          />
          <Tab 
            id="rifas" 
            label="Rifas" 
            active={activeTab === 'rifas'} 
            onClick={setActiveTab} 
          />
          <Tab 
            id="configuracoes" 
            label="Configurações" 
            active={activeTab === 'configuracoes'} 
            onClick={setActiveTab} 
          />
        </div>
      </div>
      
      {/* Conteúdo da tab Resumo */}
      {activeTab === 'resumo' && (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4 text-purple-900">Resumo Financeiro</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3 text-purple-900">Fontes de Receita</h3>
              <div className="flex items-center justify-center">
                <div className="w-full max-w-md">
                  {/* Gráfico de barras para fontes de receita */}
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-black">Mensalidades</span>
                      <span className="text-black">{formatCurrency(valorAteBixurras)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-5">
                      <div 
                        className="bg-purple-900 h-5 rounded-full" 
                        style={{ width: `${(valorAteBixurras/valorAlcancado) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-right mt-1 text-black">
                      {((valorAteBixurras/valorAlcancado) * 100).toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-black">Lucro Rifas</span>
                      <span className="text-black">{formatCurrency(lucroRifa)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-5">
                      <div 
                        className="bg-yellow-500 h-5 rounded-full" 
                        style={{ width: `${(lucroRifa/valorAlcancado) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-right mt-1 text-black">
                      {((lucroRifa/valorAlcancado) * 100).toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-gray-50 p-3 rounded text-sm">
                    <p className="text-black">Total de integrantes: <strong>{integrantes}</strong></p>
                    <p className="text-black">Total arrecadado: <strong>{formatCurrency(valorAlcancado)}</strong></p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3 text-purple-900">Valor Alcançado vs. Meta</h3>
              <div className="p-4 flex flex-col space-y-4">
                <div className="flex items-center">
                  <div className="w-full">
                    <span className="text-sm font-medium text-black">Meta: {formatCurrency(valorBixurras)}</span>
                    <div className="h-5 w-full bg-gray-200 rounded">
                      <div className="h-5 bg-purple-900 rounded" style={{ width: "100%" }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-full">
                    <span className="text-sm font-medium text-black">Alcançado: {formatCurrency(valorAlcancado)}</span>
                    <div className="h-5 w-full bg-gray-200 rounded">
                      <div 
                        className="h-5 bg-yellow-500 rounded" 
                        style={{ width: `${Math.min((valorAlcancado/valorBixurras) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-black">{((valorAlcancado/valorBixurras) * 100).toFixed(1)}%</span>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded bg-gray-50">
                  {metaAtingida ? (
                    <p className="text-green-600 font-medium">
                      ✅ Meta atingida! Excedente: {formatCurrency(excedente)}
                    </p>
                  ) : (
                    <p className="text-red-600 font-medium">
                      ⚠️ Ainda faltam {formatCurrency(valorFaltante)} para atingir a meta.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Conteúdo da tab Mensalidades */}
      {activeTab === 'mensalidades' && (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4 text-purple-900">Detalhes das Mensalidades</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card 
              title="Número de Integrantes" 
              value={integrantes}
              color="text-purple-900" 
            />
            <Card 
              title="Valor por Integrante/mês" 
              value={formatCurrency(valorMensal)}
              color="text-purple-900" 
            />
            <Card 
              title="Valor de Entrada" 
              value={formatCurrency(valorEntrada)}
              color="text-purple-900" 
            />
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-purple-900">Cálculo da Arrecadação</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-black">Valor entrada total:</p>
                  <p className="font-medium text-black">{formatCurrency(valorEntrada * integrantes)}</p>
                </div>
                <div>
                  <p className="text-sm text-black">Valor mensalidades (4 parcelas):</p>
                  <p className="font-medium text-black">{formatCurrency(valorMensal * 4 * integrantes)}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-black">Valor total arrecadado:</p>
                <p className="font-bold text-lg text-black">{formatCurrency(valorAteBixurras)}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2 text-purple-900">Impacto no Orçamento Total</h3>
            <div className="h-6 w-full bg-gray-200 rounded">
              <div 
                className="h-6 bg-purple-900 rounded flex items-center justify-center text-white text-sm" 
                style={{ width: `${(valorAteBixurras/valorAlcancado) * 100}%` }}
              >
                {((valorAteBixurras/valorAlcancado) * 100).toFixed(1)}%
              </div>
            </div>
            <p className="text-sm text-black mt-2">
              As mensalidades representam {((valorAteBixurras/valorAlcancado) * 100).toFixed(1)}% do valor total arrecadado.
            </p>
          </div>
        </div>
      )}
      
      {/* Conteúdo da tab Rifas */}
      {activeTab === 'rifas' && (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4 text-purple-900">Detalhes das Rifas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card 
              title="Faturamento Total" 
              value={formatCurrency(faturamentoRifa)}
              color="text-green-600" 
            />
            <Card 
              title="Premiações" 
              value={formatCurrency(premiacoes)}
              color="text-red-500" 
            />
            <Card 
              title="Lucro Líquido" 
              value={formatCurrency(lucroRifa)}
              color="text-purple-900" 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium mb-3 text-purple-900">Distribuição de Valores</h3>
              <div className="flex items-center justify-center">
                <div className="w-full">
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-black">Lucro</span>
                      <span className="text-black">{formatCurrency(lucroRifa)}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-6">
                        <div 
                          className="bg-purple-900 h-6 rounded-full flex items-center justify-center text-white text-sm" 
                          style={{ width: `${(lucroRifa/faturamentoRifa) * 100}%` }}
                        >
                          {((lucroRifa/faturamentoRifa) * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-black">Premiações</span>
                      <span className="text-black">{formatCurrency(premiacoes)}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-6">
                        <div 
                          className="bg-yellow-500 h-6 rounded-full flex items-center justify-center text-white text-sm" 
                          style={{ width: `${(premiacoes/faturamentoRifa) * 100}%` }}
                        >
                          {((premiacoes/faturamentoRifa) * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3 text-purple-900">Detalhes da Operação</h3>
              <table className="min-w-full">
                <tbody>
                  <tr>
                    <td className="py-2 text-black">Rifas por integrante:</td>
                    <td className="py-2 font-medium text-right text-black">{rifasPorIntegrante}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-black">Rifas totais:</td>
                    <td className="py-2 font-medium text-right text-black">{rifasTotais}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-black">Valor da rifa:</td>
                    <td className="py-2 font-medium text-right text-black">{formatCurrency(valorRifa)}</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-2 text-black font-medium">Faturamento total:</td>
                    <td className="py-2 font-bold text-right text-black">{formatCurrency(faturamentoRifa)}</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-800">
                  As rifas representam {((lucroRifa/valorAlcancado) * 100).toFixed(1)}% do valor total arrecadado para o evento.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Conteúdo da tab Configurações */}
      {activeTab === 'configuracoes' && (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4 text-purple-900">Configurações do Bixurras</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3 text-purple-900">Configurações Gerais</h3>
              <InputField 
                label="Valor do Bixurras (Meta)" 
                value={valorBixurras} 
                onChange={setValorBixurras} 
                step="0.01" 
              />
              <InputField 
                label="Número de Integrantes" 
                value={integrantes} 
                onChange={setIntegrantes} 
              />
              
              <div className="mt-4 p-3 bg-purple-50 rounded">
                <h4 className="font-medium text-purple-800 mb-2">Resumo Atual</h4>
                <p className="text-sm text-black">Meta: {formatCurrency(valorBixurras)}</p>
                <p className="text-sm text-black">Valor alcançado: {formatCurrency(valorAlcancado)}</p>
                {metaAtingida ? (
                  <p className="text-sm text-green-600 font-medium mt-2">
                    ✅ Meta atingida! Excedente: {formatCurrency(excedente)}
                  </p>
                ) : (
                  <p className="text-sm text-red-600 font-medium mt-2">
                    ⚠️ Ainda faltam {formatCurrency(valorFaltante)} para atingir a meta.
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 text-purple-900">Configurações de Mensalidades</h3>
                <InputField 
                  label="Valor Mensal" 
                  value={valorMensal} 
                  onChange={setValorMensal} 
                  step="0.01" 
                />
                <InputField 
                  label="Valor de Entrada" 
                  value={valorEntrada} 
                  onChange={setValorEntrada} 
                  step="0.01" 
                />
                <p className="text-sm text-black mt-2">
                  Valor até o bixurras (entrada + 4 mensalidades): {formatCurrency(valorAteBixurras)}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3 text-purple-900">Configurações de Rifas</h3>
                <InputField 
                  label="Rifas por Integrante" 
                  value={rifasPorIntegrante} 
                  onChange={setRifasPorIntegrante} 
                />
                <InputField 
                  label="Valor da Rifa" 
                  value={valorRifa} 
                  onChange={setValorRifa} 
                  step="0.01" 
                />
                <InputField 
                  label="Valor das Premiações" 
                  value={premiacoes} 
                  onChange={setPremiacoes} 
                  step="0.01" 
                />
                <p className="text-sm text-black mt-2">
                  Lucro projetado das rifas: {formatCurrency(lucroRifa)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Rodapé */}
      <div className="mt-6 text-center text-gray-500 text-sm">
        <p>Local: Sítio do Ebrom</p>
        <p className="mt-1">Dados atualizados em {new Date().toLocaleDateString('pt-BR')}</p>
      </div>
    </div>
  );
};

export default BixurrasDashboard2;
import { useState } from 'react';

interface TaxInput {
    state: string;
    homeValue: number;
    taxRate: number;
    monthlyLivingCosts: number;
}

const STATES = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const TAX_TIPS: string[] = [
    'Property tax rates vary significantly by state and locality',
    'Some states offer homestead exemptions that reduce taxable value',
    'Property taxes may be deductible on federal income taxes',
    'Reassessments can change your tax burden over time'
];

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const pct = (n: number) => `${n.toFixed(1)}%`;

function App() {
    const [values, setValues] = useState<TaxInput>({ state: 'Texas', homeValue: 350000, taxRate: 1.8, monthlyLivingCosts: 4500 });
    const handleChange = (field: keyof TaxInput, value: string | number) => setValues(prev => ({ ...prev, [field]: value }));

    // Calculate annual property tax
    const annualPropertyTax = Math.round(values.homeValue * (values.taxRate / 100));
    const monthlyTaxImpact = Math.round(annualPropertyTax / 12);

    // Calculate annual living costs
    const annualLivingCosts = values.monthlyLivingCosts * 12;

    // Tax as percentage of living costs
    const taxToLivingRatio = annualLivingCosts > 0 ? (annualPropertyTax / annualLivingCosts) * 100 : 0;

    // Combined annual burden
    const combinedBurden = annualPropertyTax + annualLivingCosts;

    const breakdownData = [
        { label: 'Annual Property Taxes', value: fmt(annualPropertyTax), isTotal: false },
        { label: 'Annual Living Costs', value: fmt(annualLivingCosts), isTotal: false },
        { label: 'Combined Annual Burden', value: fmt(combinedBurden), isTotal: true }
    ];

    return (
        <main style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <header style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>
                <h1 style={{ marginBottom: 'var(--space-2)' }}>Property Tax vs Cost of Living Calculator (2026)</h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>Compare property tax costs to living expenses</p>
            </header>

            <div className="card">
                <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                    <div>
                        <label htmlFor="state">State</label>
                        <select id="state" value={values.state} onChange={(e) => handleChange('state', e.target.value)}>
                            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <div>
                            <label htmlFor="homeValue">Home Value ($)</label>
                            <input id="homeValue" type="number" min="50000" max="5000000" step="10000" value={values.homeValue || ''} onChange={(e) => handleChange('homeValue', parseInt(e.target.value) || 0)} placeholder="350000" />
                        </div>
                        <div>
                            <label htmlFor="taxRate">Property Tax Rate (%)</label>
                            <input id="taxRate" type="number" min="0" max="5" step="0.1" value={values.taxRate || ''} onChange={(e) => handleChange('taxRate', parseFloat(e.target.value) || 0)} placeholder="1.8" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="monthlyLivingCosts">Estimated Monthly Living Costs ($)</label>
                        <input id="monthlyLivingCosts" type="number" min="500" max="50000" step="100" value={values.monthlyLivingCosts || ''} onChange={(e) => handleChange('monthlyLivingCosts', parseInt(e.target.value) || 0)} placeholder="4500" />
                    </div>
                    <button className="btn-primary" type="button">Calculate Costs</button>
                </div>
            </div>

            <div className="card results-panel">
                <div className="text-center">
                    <h2 className="result-label" style={{ marginBottom: 'var(--space-2)' }}>Annual Property Tax Cost</h2>
                    <div className="result-hero">{fmt(annualPropertyTax)}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>per year in {values.state}</div>
                </div>
                <hr className="result-divider" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', textAlign: 'center' }}>
                    <div>
                        <div className="result-label">Monthly Tax Impact</div>
                        <div className="result-value">{fmt(monthlyTaxImpact)}</div>
                    </div>
                    <div style={{ borderLeft: '1px solid #BAE6FD', paddingLeft: 'var(--space-4)' }}>
                        <div className="result-label">Tax vs Living Ratio</div>
                        <div className="result-value" style={{ color: taxToLivingRatio > 15 ? '#DC2626' : taxToLivingRatio > 10 ? '#D97706' : '#16A34A' }}>{pct(taxToLivingRatio)}</div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-4)' }}>Property Tax Considerations</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 'var(--space-3)' }}>
                    {TAX_TIPS.map((item, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-primary)', flexShrink: 0 }} />{item}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="ad-container"><span>Advertisement</span></div>

            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
                    <h3 style={{ fontSize: '1rem' }}>Cost Breakdown</h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem' }}>
                    <tbody>
                        {breakdownData.map((row, i) => (
                            <tr key={i} style={{ borderBottom: i === breakdownData.length - 1 ? 'none' : '1px solid var(--color-border)', backgroundColor: row.isTotal ? '#F0F9FF' : (i % 2 ? '#F8FAFC' : 'transparent') }}>
                                <td style={{ padding: 'var(--space-3) var(--space-6)', color: 'var(--color-text-secondary)', fontWeight: row.isTotal ? 600 : 400 }}>{row.label}</td>
                                <td style={{ padding: 'var(--space-3) var(--space-6)', textAlign: 'right', fontWeight: 600, color: row.isTotal ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>{row.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ maxWidth: 600, margin: '0 auto', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                <p>This calculator provides estimates of property tax costs relative to living expenses. Actual property tax rates vary by county and municipality within each state. The figures shown are estimates only and do not constitute tax advice. Living costs depend on individual lifestyle and location factors. Consult local tax authorities or a tax professional for accurate property tax information.</p>
            </div>

            <footer style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', marginTop: 'var(--space-8)' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-4)', fontSize: '0.875rem' }}>
                    <li>• Estimates only</li><li>• Simplified assumptions</li><li>• Free to use</li>
                </ul>
                <nav style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
                    <a href="https://scenariocalculators.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Privacy Policy</a>
                    <span style={{ color: '#64748B' }}>|</span>
                    <a href="https://scenariocalculators.com/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Terms of Service</a>
                </nav>
                <p style={{ marginTop: 'var(--space-4)', fontSize: '0.75rem' }}>&copy; 2026 Property Tax Calculator</p>
            </footer>

            <div className="ad-container ad-sticky"><span>Advertisement</span></div>
        </main>
    );
}

export default App;

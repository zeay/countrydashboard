// app/[code]/page.tsx
"use client";

import { useQuery } from 'react-query';
import { fetchCountryByCode } from '../../lib/api';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically load the Map component to avoid server-side rendering issues with Leaflet
const Map = dynamic(() => import('../Map'), { ssr: false });

export default function CountryDetail({ params }: { params: { code: string } }) {
    const countryCode = params.code.toUpperCase();

    const { data: country, error, isLoading } = useQuery<any>(
        ['country', countryCode],
        () => fetchCountryByCode(countryCode)
    );

    if (isLoading) return <p>Loading country details...</p>;
    if (error) return <p>Error loading country details</p>;

    return (
        <div className="container mx-auto">
            <Link href="/" className="text-blue-500">
                ← Back to Countries List
            </Link>

            <div className="border p-6 mt-4 rounded">
                <img
                    src={country[0]?.flags.png}
                    alt={country[0]?.name.common}
                    className="w-full h-64 object-cover mb-4"
                />
                <h1 className="text-3xl font-bold mb-4">{country[0]?.name.common}</h1>
                <p><strong>Official Name:</strong> {country[0]?.name.official}</p>
                <p><strong>Region:</strong> {country[0]?.region}</p>
                <p><strong>Subregion:</strong> {country[0]?.subregion}</p>
                <p><strong>Population:</strong> {country[0]?.population.toLocaleString()}</p>
                <p><strong>Capital:</strong> {country[0]?.capital?.[0]}</p>
                <p><strong>Timezones:</strong> {country[0]?.timezones?.join(', ')}</p>

                {country[0]?.borders?.length ? (
                    <p><strong>Borders:</strong> {country[0].borders.join(', ')}</p>
                ) : (
                    <p><strong>Borders:</strong> No neighboring countries</p>
                )}

                <p><strong>Top-level Domain:</strong> {country[0]?.tld?.join(', ')}</p>
                <p><strong>Languages:</strong> {Object.values(country[0]?.languages || {}).join(', ')}</p>
                <p><strong>Currencies:</strong> {Object.values(country[0]?.currencies || {})
                    .map((currency: any) => `${currency.name} (${currency.symbol})`)
                    .join(', ')}</p>

                {/* Display a map with the country's location */}
                {country[0]?.latlng && (
                    <div className="mt-6">
                        <h3 className="text-xl font-bold mb-4">Country Location</h3>
                        <Map center={country[0].latlng} />
                    </div>
                )}
            </div>
        </div>
    );
}

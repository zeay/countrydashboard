"use client";

import { useQuery } from 'react-query';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useState, useEffect } from 'react';
import { fetchCountries, searchCountries } from '../lib/api';
import Link from 'next/link';

export default function CountryList() {
    const [searchQuery, setSearchQuery] = useState('');
    const [regionFilter, setRegionFilter] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [countries, setCountries] = useState<any[]>([]);
    const [displayedCountries, setDisplayedCountries] = useState<any[]>([]);
    const [count, setCount] = useState(10);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300);
        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    const { data, error, isLoading, refetch } = useQuery(
        ['countries', debouncedSearchQuery, regionFilter],
        () => {
            if (debouncedSearchQuery || regionFilter) {
                return searchCountries({ name: debouncedSearchQuery, region: regionFilter });
            }
            return fetchCountries();
        },
        {
            onSuccess: (data) => {
                setCountries(data);
                setDisplayedCountries(data.slice(0, 10));
            },
        }
    );

    const loadMore = () => {
        const newCountries = countries.slice(displayedCountries.length, displayedCountries.length + 10);
        setDisplayedCountries((prev) => [...prev, ...newCountries]);
        setCount(displayedCountries.length + newCountries.length);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRegionFilter(e.target.value);
        refetch();
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading countries</p>;

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">Country List</h1>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by country name"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="border p-2 rounded w-full"
                />
            </div>
            <div className="mb-4">
                <select
                    value={regionFilter}
                    onChange={handleRegionChange}
                    className="border p-2 rounded w-full"
                >
                    <option value="">Filter by Region</option>
                    <option value="Africa">Africa</option>
                    <option value="Americas">Americas</option>
                    <option value="Asia">Asia</option>
                    <option value="Europe">Europe</option>
                    <option value="Oceania">Oceania</option>
                </select>
            </div>
            <InfiniteScroll
                dataLength={displayedCountries.length}
                next={loadMore}
                hasMore={count < countries.length}
                loader={<h4>Loading more countries...</h4>}
                endMessage={<p>No more countries to show</p>}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {displayedCountries.map((country: any) => (
                        <Link key={country.cca3} href={`/${country.cca3}`} className="block">
                            <div key={country.cca3} className="border p-4 rounded">
                                <img
                                    src={country.flags.png}
                                    alt={country.name.common}
                                    className="w-full h-32 object-cover"
                                />
                                <h2 className="text-xl mt-2">{country.name.common}</h2>
                                <p>Region: {country.region}</p>
                                <p>Population: {country.population.toLocaleString()}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    );
}

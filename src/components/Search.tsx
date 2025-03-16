const Search = ({searchTerm, setsearchTerm}:{searchTerm:string, setsearchTerm:(term: string) => void}) => {
    return (
        <div className="search">
            <div>
                <img src="./Vector.svg" alt="search icon" />
                <input type="text" placeholder="Search" value={searchTerm} onChange={(e) => setsearchTerm(e.target.value)} />
            </div>
        </div>
    )

}
export default Search;  
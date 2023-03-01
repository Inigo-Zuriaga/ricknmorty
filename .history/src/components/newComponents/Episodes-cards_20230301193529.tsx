import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import Card from "../library/visual/Card";
import "./Episodes-cards.css";

type Episode = {
  id: string;
  name: string;
  air_date: string;
};

type EpisodeData = {
  episodes: {
    info: {
      count: number;
    };
    results: Episode[];
  };
};

type EpisodeProps = {
  initialPage?: number;
  pageSize?: number;
};

const EPISODES_QUERY = gql`
  query GetEpisodes($page: Int!) {
    episodes(page: $page){
      info {
        count
      }
      results {
        id
        name
        air_date
      }
    }
  }
`;

const EpisodesCards = ({ initialPage = 1, pageSize = 8 }: EpisodeProps) => {
  const [page, setPage] = useState(initialPage);
  const { loading, error, data } = useQuery<EpisodeData>(EPISODES_QUERY, {
    variables: { page: page, pageSize: pageSize },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const episodes = data?.episodes?.results || [];

  const handleShowMore = () => {
    setPage(page + 1);
    console.log(page);
  };
    

  return (
    <>
      <div className="cardsContainer">
        {episodes.map((episode) => (
          <Card
            key={episode.id}
            title={episode.name}
            subtitle={`ID: ${episode.id} Air date: ${episode.air_date}`}
          />
        ))}
      </div>
      {episodes.length > pageSize && (
        <div className="showMoreButtonContainer">
          <button onClick={handleShowMore}>Load more</button>
        </div>
      )}
    </>
  );
};

export default EpisodesCards;

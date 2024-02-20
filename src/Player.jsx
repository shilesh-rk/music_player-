import React, { useState, useEffect } from "react";
import song1 from "./assets/krisnha-flute-new-3579.mp3";
import song2 from "./assets/salaar-ringtones-bgm-mobcup-com-co-61864.mp3"
const MusicPlayer = () => {
	// Component State
	const defaultPlaylist = [song1,
		song2,
	];
	const [playlist, setPlaylist] = useState(defaultPlaylist);
	const [playingTrackIndex, setPlayingTrackIndex] = useState(-1);
	const [audioFile, setAudioFile] = useState(null);

	// playlist from local storage on component mount
	useEffect(() => {
		const storedPlaylist =
			JSON.parse(localStorage.getItem("playlist")) || defaultPlaylist;
		const storedPlayingTrackIndex =
			parseInt(localStorage.getItem("playingTrackIndex"), 10) || -1;

		setPlaylist(storedPlaylist);
		setPlayingTrackIndex(storedPlayingTrackIndex);
	}, []);

	// Effect to play audio when playingTrackIndex or audioFile changes
	useEffect(() => {
		if (playingTrackIndex !== -1 && audioFile) {
			audioFile.src = playlist[playingTrackIndex];
			audioFile.currentTime =
				parseFloat(localStorage.getItem("playingTime")) || 0;

			// For Error checking
			const trackError = audioFile.play();
			if (trackError !== undefined) {
				trackError.catch((error) =>{
					console.error("Error playing audio:", error)
				localStorage.removeItem("playlist")}
				);
			}

			localStorage.setItem("playingTrackIndex", playingTrackIndex);
		}
	}, [playingTrackIndex, audioFile, playlist]);

	// handle file upload
	const handleFileUpload = (event) => {
		const files = event.target.files;
		const newPlaylist = [...playlist];

		for (let i = 0; i < files.length; i++) {
			const fileURL = URL.createObjectURL(files[i]);
			newPlaylist.push(fileURL);
			localStorage.setItem(`Track_${i}`, fileURL);
		}

		localStorage.setItem("playlist", JSON.stringify(newPlaylist));
		setPlaylist(newPlaylist);
	};

	// handle play button click
	const handlePlay = (index) => {
		if (playingTrackIndex !== index) {
			localStorage.removeItem("playingTime");
		}
		setPlayingTrackIndex(index);
		// setAudioFile(track)
	};

	// handle audio endTime
	const handleEnded = () => {
		if (playingTrackIndex < playlist.length - 1) {
			setPlayingTrackIndex(playingTrackIndex + 1);
		} else {
			setPlayingTrackIndex(playlist.length - 1);
		}
		localStorage.removeItem("playingTime");
	};

	// Function to handle audio time update
	const handleTimeUpdate = () => {
		if (audioFile) {
			localStorage.setItem("playingTime", audioFile.currentTime);
		}
	};

	return (
		<div>
			<div className='container'>
				<input
					className='file_loader'
					type='file'
					accept='audio/*'
					onChange={handleFileUpload}
				/>
			</div>

			<div>
				{playingTrackIndex !== -1 && (
					<>
						<h1>
							Now Playing: <span>{`Track ${playingTrackIndex + 1}`}</span>
						</h1>
						<audio
							controls
							ref={(audio) => setAudioFile(audio)}
							onEnded={handleEnded}
							onTimeUpdate={handleTimeUpdate}
						/>
					</>
				)}
			</div>
			<div>
				<h2>Playlist</h2>
				<ul>
					{playlist.map((track, index) => (
						<li key={index}>
							<button
								onClick={() => handlePlay(index)}
								className={playingTrackIndex === index ? "playing" : ""}>
								{`Track ${index + 1}`}
							</button>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default MusicPlayer;

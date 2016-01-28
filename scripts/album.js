var setSong = function(songNumber) {
     if (currentSoundFile) {
         currentSoundFile.stop();
     }
     
  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
         // #2
         formats: [ 'mp3' ],
         preload: true
  }); 
 
     setVolume(currentVolume);
 };

 var seek = function(time) {
     if (currentSoundFile) {
         currentSoundFile.setTime(time);
     }
 }
 
 var setVolume = function(volume) {
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }
};    

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]')
};
var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
     + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     var $row = $(template);
 
     var clickHandler = function() {
        var songNumber = parseInt($(this).attr('data-song-number'));
     
        if (currentlyPlayingSongNumber !== null) {
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingCell);
        }
     
        if (currentlyPlayingSongNumber !== songNumber) {
            $(this).html(pauseButtonTemplate);
            setSong(songNumber);
            currentSoundFile.play();
            updatePlayerBarSong();     
            updateSeekBarWhileSongPlays();
            nextSong();
            previousSong();
            var $volumeFill = $('.volume .fill');
            var $volumeThumb = $('.volume .thumb');
            $volumeFill.width(currentVolume + '%');
            $volumeThumb.css({left: currentVolume + '%'});
            
            } else if (currentlyPlayingSongNumber === songNumber) {
            if (currentSoundFile.isPaused()) {
                $(currentlyPlayingSongNumber).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
            } else {
                $(currentlyPlayingSongNumber).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause();
            }
        };
     }
      
     var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');
        var songInitialize = songNumberCell.attr('0')
        
        if (currentSoundFile) {
            if (currentSoundFile.isPaused()) {
                songNumberCell.html(playButtonTemplate);
            }
            else if (currentSoundFile.play()) {
                songNumberCell.html(pauseButtonTemplate);
            } 
        }
        else {
            songNumberCell.html(playButtonTemplate); 
         }

     };
    
     var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');
        

        if (songNumber !== currentlyPlayingSongNumber) {
                songNumberCell.html(songNumber);
        }
        
            
     };
      
     $row.find('.song-item-number').click(clickHandler);
     // #2
     $row.hover(onHover, offHover);
     // #3
     return $row;     
};

 var setCurrentAlbum = function(album) {
     currentAlbum = album;
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
 
     // #2
     $albumTitle.text(album.name);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
 
     // #3
     $albumSongList.empty();
 
     // #4
     for (i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
         $albumSongList.append($newRow);
     }
 };
 
 var updateSeekBarWhileSongPlays = function() {
     if (currentSoundFile) {
         // #10
         currentSoundFile.bind('timeupdate', function(event) {
             // #11
             var seekBarFillRatio = this.getTime() / this.getDuration();
             var $seekBar = $('.seek-control .seek-bar');
 
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
     }
 };

 var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    // #1
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
 
    // #2
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 };
 
var setupSeekBars = function() {
     var $seekBars = $('.player-bar .seek-bar');
 
     $seekBars.click(function(event) {
         // #3
         var offsetX = event.pageX - $(this).offset().left;
         var barWidth = $(this).width();
         // #4
         var seekBarFillRatio = offsetX / barWidth;
        
         if ($(this).parent().attr('class') == 'seek-control') {
             seek(seekBarFillRatio * currentSoundFile.getDuration());
         } else {
             setVolume(seekBarFillRatio * 100);
         }
         // #5
         updateSeekPercentage($(this), seekBarFillRatio);
     });
     // #7
     $seekBars.find('.thumb').mousedown(function(event) {
         // #8
         var $seekBar = $(this).parent();
 
         // #9
         $(document).bind('mousemove.thumb', function(event){
             var offsetX = event.pageX - $seekBar.offset().left;
             var barWidth = $seekBar.width();
             var seekBarFillRatio = offsetX / barWidth;
 
             if ($seekBar.parent().attr('class') == 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());   
             } else {
                setVolume(seekBarFillRatio);
             }             
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
 
         // #10
         $(document).bind('mouseup.thumb', function() {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
         });
     });    
 };

var trackIndex = function(album, song){
    return album.songs.indexOf(song);
};

 var updatePlayerBarSong = function() {
     
    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
};


var nextSong = function() {
    
    var previousSongNumber = function(list) {
        return list == 0 ? currentAlbum.songs.length : list;
    }; 
    
    var currentSongList = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongList++;
    
    if (currentSongList >= currentAlbum.songs.length) {
        currentSongList = 0;
    }
    
    setSong(currentSongList + 1);
    currentSoundFile.play();
    currentSongFromAlbum = currentAlbum.songs[currentSongList];
    
    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = previousSongNumber(currentSongList);
    var $nextSong = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSong = getSongNumberCell(lastSongNumber);
    
    $nextSong.html(pauseButtonTemplate);
    $lastSong.html(lastSongNumber);
};


var previousSong = function () {
    
    var previousSongNumber = function(list) {
        return list == (currentAlbum.songs.length - 1) ? 1 : list + 2;
    };
    
    var currentSongList = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongList--;
    
    if (currentSongList < 0) {
        currentSongList = (currentAlbum.songs.length -1);
    }
    
    setSong(currentSongList + 1);
    currentSoundFile.play();
    currentSongFromAlbum = currentAlbum.songs[currentSongList];
    
    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = previousSongNumber(currentSongList);
    var $nextSong = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSong = getSongNumberCell(lastSongNumber);
    
    $nextSong.html(pauseButtonTemplate);
    $lastSong.html(lastSongNumber);
};

var playSong = function() {
        var songNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
        //var songNumber = parseInt($(this).attr('data-song-number')); 
    //    var songInitialize = songNumberCell.attr('0');
    //is song palying? yes: stop, cnahge html of button
    //song not palying? 
    //songnumber set? yes: play no: paly first song & set html of button
    
    if (currentSoundFile) {
        if (currentSoundFile.isPaused()) {
            currentSoundFile.play();
            $('.main-controls .play-pause').html(playerBarPauseButton);
        }
        else if (currentSoundFile.play()) {
            
            $('.main-controls .play-pause').html(playerBarPlayButton);
            currentSoundFile.stop();
            songNumberCell.html(currentlyPlayingSongNumber);
        } 

    }
    else {
        setSong(1);
        currentSoundFile.play()
        $('.main-controls .play-pause').html(playerBarPauseButton);
     }
    
    
//    var songNumber = parseInt($(this).attr('data-song-number'));
//     
//        if (currentlyPlayingSongNumber !== null) {
//            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
//            currentlyPlayingCell.html(currentlyPlayingCell);
//        }
//     
//        if (currentlyPlayingSongNumber !== songNumber) {
//            $(this).html(pauseButtonTemplate);
//            setSong(songNumber);
//            currentSoundFile.play();
//            updatePlayerBarSong();     
//            updateSeekBarWhileSongPlays();
//            nextSong();
//            previousSong();
//            var $volumeFill = $('.volume .fill');
//            var $volumeThumb = $('.volume .thumb');
//            $volumeFill.width(currentVolume + '%');
//            $volumeThumb.css({left: currentVolume + '%'});
//            
//            } else if (currentlyPlayingSongNumber === songNumber) {
//            if (currentSoundFile.isPaused()) {
//                $(currentlyPlayingSongNumber).html(pauseButtonTemplate);
//                $('.main-controls .play-pause').html(playerBarPauseButton);
//                currentSoundFile.play();
//            } else {
//                $(currentlyPlayingSongNumber).html(playButtonTemplate);
//                $('.main-controls .play-pause').html(playerBarPlayButton);
//                currentSoundFile.pause();
//            }
//        };
    
};


 var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
 var playerBarPlayButton = '<span class="ion-play"></span>';
 var playerBarPauseButton = '<span class="ion-pause"></span>';
 // Store state of playing songs
 var currentAlbum = null;
 var currentlyPlayingSongNumber = null;
 var currentSongFromAlbum = null;
 var currentSoundFile = null; 
 var currentVolume = 80;    
 var $previousButton = $('.main-controls .previous');
 var $nextButton = $('.main-controls .next');
 var $playButton =$('.main-controls .play-pause')

 $(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     setupSeekBars();     
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);     
    $playButton.click(playSong); 
 });
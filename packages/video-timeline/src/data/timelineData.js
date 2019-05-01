import Flatted from 'flatted/esm';

const DATA = `
[{"commentThreads":"1","videoTags":"2"},["3","4","5","6","7"],["8","9","10","11","12","13","14","15","16","17"],{"created":"18","duration":2645,"id":24108,"modified":"18","project_id":1254,"start_seconds":0,"text":"19","user":"20","youtube_id":"21","c_video_id":"22","c_timeline_offset":0,"c_pretty_created_date":"23","replies":"24","video":"25"},{"created":"26","duration":2645,"id":24109,"modified":"26","project_id":1254,"replies":"27","start_seconds":681.622923961853,"text":"28","user":"29","youtube_id":"21","c_video_id":"22","c_timeline_offset":25.770242871903704,"c_pretty_created_date":"30","video":"25"},{"created":"31","duration":2645,"id":24112,"modified":"31","project_id":1254,"start_seconds":761.505806986649,"text":"32","user":"33","youtube_id":"21","c_video_id":"22","c_timeline_offset":28.790389678134176,"c_pretty_created_date":"34","video":"25","replies":"35"},{"created":"36","duration":2645,"id":24116,"modified":"36","project_id":1254,"start_seconds":1098.09159298093,"text":"37","user":"38","youtube_id":"21","c_video_id":"22","c_timeline_offset":41.515750207218524,"c_pretty_created_date":"39","video":"25","replies":"40"},{"created":"41","duration":2645,"id":24119,"modified":"41","project_id":1254,"start_seconds":2644.5438548753,"text":"42","user":"43","youtube_id":"21","c_video_id":"22","c_timeline_offset":99.98275443762948,"c_pretty_created_date":"44","video":"25","replies":"45"},{"id":20682,"instances":"46","project_id":1254,"project_tag":"47","project_tag_id":4000,"video_id":11503,"youtube_id":"21","c_video_id":"22","video":"25"},{"id":20677,"instances":"48","project_id":1254,"project_tag":"49","project_tag_id":3981,"video_id":11503,"youtube_id":"21","c_video_id":"22","video":"25"},{"id":20681,"instances":"50","project_id":1254,"project_tag":"51","project_tag_id":3999,"video_id":11503,"youtube_id":"21","c_video_id":"22","video":"25"},{"id":20675,"instances":"52","project_id":1254,"project_tag":"53","project_tag_id":3995,"video_id":11503,"youtube_id":"21","c_video_id":"22","video":"25"},{"id":20680,"instances":"54","project_id":1254,"project_tag":"55","project_tag_id":3998,"video_id":11503,"youtube_id":"21","c_video_id":"22","video":"25"},{"id":20679,"instances":"56","project_id":1254,"project_tag":"57","project_tag_id":3997,"video_id":11503,"youtube_id":"21","c_video_id":"22","video":"25"},{"id":20673,"instances":"58","project_id":1254,"project_tag":"59","project_tag_id":3993,"video_id":11503,"youtube_id":"21","c_video_id":"22","video":"25"},{"id":20674,"instances":"60","project_id":1254,"project_tag":"61","project_tag_id":3994,"video_id":11503,"youtube_id":"21","c_video_id":"22","video":"25"},{"id":20678,"instances":"62","project_id":1254,"project_tag":"63","project_tag_id":3996,"video_id":11503,"youtube_id":"21","c_video_id":"22","video":"25"},{"id":20683,"instances":"64","project_id":1254,"project_tag":"65","project_tag_id":4001,"video_id":11503,"youtube_id":"21","c_video_id":"22","video":"25"},"2019-04-24T16:05:35+00:00","START",{"email":"66","first_name":"67","id":2591,"last_name":"68","profile_img_url":"69"},"9G8dmsnFjL4","1254:9G8dmsnFjL4","7.05pm Apr 24th",[],{"channel_id":"70","channel_name":"71","created":"72","duplicate_count":0,"duration":2645,"favourited":false,"id":11503,"location_overridden":false,"missing_from_youtube":false,"modified":"72","name":"73","notes":"74","precise_location":true,"pretty_created":"75","pretty_duration":"76","pretty_publish_date":"77","project_id":1254,"publish_date":"78","recorded_date_overridden":false,"tag_count":10,"watch_count":2,"watched":true,"youtube_id":"21","c_id":"22","c_thumbnail_url":"79","c_theatre_url":"80","project":"81"},"2019-04-24T16:09:57+00:00",["82"],"Speaks Spanish",{"email":"83","first_name":"84","google_plus_profile":"85","id":2376,"last_name":"86","profile_img_url":"87"},"7.09pm Apr 24th","2019-04-24T16:14:05+00:00","Will make Dreamers US Citizens",{"email":"83","first_name":"84","google_plus_profile":"85","id":2376,"last_name":"86","profile_img_url":"87"},"7.14pm Apr 24th",[],"2019-04-24T16:25:02+00:00","Gerrymandering.",{"email":"83","first_name":"84","google_plus_profile":"85","id":2376,"last_name":"86","profile_img_url":"87"},"7.25pm Apr 24th",[],"2019-04-25T08:28:07+00:00","END",{"email":"66","first_name":"67","id":2591,"last_name":"68","profile_img_url":"69"},"11.28am Apr 25th",[],["88"],{"created":"89","global_tag_id":3978,"id":4000,"modified":"89","name":"90","project_id":1254,"subTags":"91","project":"81","video_tag_instance_count":1},["92","93"],{"created":"94","global_tag_id":3959,"id":3981,"modified":"94","name":"95","project_id":1254,"subTags":"96","project":"81","video_tag_instance_count":3},["97"],{"created":"98","global_tag_id":3977,"id":3999,"modified":"98","name":"99","project_id":1254,"subTags":"100","project":"81","video_tag_instance_count":1},["101"],{"created":"102","global_tag_id":3973,"id":3995,"modified":"102","name":"103","project_id":1254,"subTags":"104","project":"81","video_tag_instance_count":1},["105"],{"created":"106","global_tag_id":3976,"id":3998,"modified":"106","name":"107","project_id":1254,"subTags":"108","project":"81","video_tag_instance_count":1},["109"],{"created":"110","global_tag_id":3975,"id":3997,"modified":"110","name":"111","project_id":1254,"subTags":"112","project":"81","video_tag_instance_count":1},["113"],{"created":"114","global_tag_id":3971,"id":3993,"modified":"114","name":"115","project_id":1254,"subTags":"116","project":"81","video_tag_instance_count":1},["117","118"],{"created":"119","global_tag_id":3972,"id":3994,"modified":"119","name":"120","project_id":1254,"subTags":"121","project":"81","video_tag_instance_count":2},["122"],{"created":"123","global_tag_id":3974,"id":3996,"modified":"123","name":"28","project_id":1254,"subTags":"124","project":"81","video_tag_instance_count":1},["125"],{"created":"126","global_tag_id":3979,"id":4001,"modified":"126","name":"127","project_id":1254,"subTags":"128","project":"81","video_tag_instance_count":1},"laurian@gmail.com","Laurian","Gridinoc","https://lh5.googleusercontent.com/-Fri-UYSxRqc/AAAAAAAAAAI/AAAAAAAABBI/ecSU-3hNAk0/s100/photo.jpg","UC8kJAX_zxlDctZpgJxdA-Fw","Dodge Landesman","2019-04-24T09:50:57+00:00","Road to the White House 2020 Up Close in New Hampshire Beto O'Rourke","Former Congressman Beto O'Rourke was at Conseulo's Taqueria, in Manchester, New Hampshire","Apr 24, 2019","44:05","Mar 22, 2019","2019-03-22T19:14:14+00:00","//i3.ytimg.com/vi/9G8dmsnFjL4/default.jpg","/project/1254/video/9G8dmsnFjL4",{"admin_ids":"129","assigned_user_ids":"130","created":"131","current_user_info":"132","description":"133","id":1254,"image_url":"134","modified":"135","name":"136","owner":"137","privacy_project":1,"privacy_tags":1,"projecttags":"138","video_count":4,"video_tag_instance_count":24,"videos":"139"},{"created":"140","duration":2645,"id":24118,"modified":"141","project_id":1254,"start_seconds":681.622923961853,"text":"142","thread_id":24109,"user":"143","youtube_id":"21","c_pretty_created_date":"144","thread":"4"},"mark@hyperaud.io","Mark","https://plus.google.com/109653547337875735502","Boas","https://lh4.googleusercontent.com/-KAQP-uwuJ-U/AAAAAAAAAAI/AAAAAAAAAA8/m1-ILT1IqWs/s100/photo.jpg",{"created":"145","end_seconds":1074.17030567686,"global_tag_id":3978,"id":24115,"modified":"146","project_id":1254,"project_tag_id":4000,"start_seconds":1043.23066109155,"video_id":11503,"video_tag_id":20682,"youtube_id":"21","tag":"8","$$hashKey":"147"},"2019-04-24T16:23:43+00:00","Climate Change",[],{"created":"148","end_seconds":533.620087336245,"global_tag_id":3959,"id":24106,"modified":"149","project_id":1254,"project_tag_id":3981,"start_seconds":0,"video_id":11503,"video_tag_id":20677,"youtube_id":"21","tag":"9","$$hashKey":"150"},{"created":"151","end_seconds":5,"global_tag_id":3959,"id":24107,"modified":"151","project_id":1254,"project_tag_id":3981,"start_seconds":0,"video_id":11503,"video_tag_id":20677,"youtube_id":"21","tag":"9","$$hashKey":"152"},"2019-04-19T11:11:56+00:00","Commentator",[],{"created":"153","end_seconds":882.436681222708,"global_tag_id":3977,"id":24114,"modified":"154","project_id":1254,"project_tag_id":3999,"start_seconds":818.630273089645,"video_id":11503,"video_tag_id":20681,"youtube_id":"21","tag":"10","$$hashKey":"155"},"2019-04-24T16:15:48+00:00","Economy",[],{"created":"102","end_seconds":919.397379912664,"global_tag_id":3973,"id":24102,"modified":"156","project_id":1254,"project_tag_id":3995,"start_seconds":893.986899563319,"video_id":11503,"video_tag_id":20675,"youtube_id":"21","tag":"11","$$hashKey":"157"},"2019-04-24T10:14:38+00:00","Gun Violence",[],{"created":"158","end_seconds":812.822062160217,"global_tag_id":3976,"id":24113,"modified":"159","project_id":1254,"project_tag_id":3998,"start_seconds":794.655021834061,"video_id":11503,"video_tag_id":20680,"youtube_id":"21","tag":"12","$$hashKey":"160"},"2019-04-24T16:15:03+00:00","Healthcare",[],{"created":"161","end_seconds":785.414847161572,"global_tag_id":3975,"id":24111,"modified":"162","project_id":1254,"project_tag_id":3997,"start_seconds":651.43231441048,"video_id":11503,"video_tag_id":20679,"youtube_id":"21","tag":"13","$$hashKey":"163"},"2019-04-24T16:11:30+00:00","Immigration",[],{"created":"164","end_seconds":1037.2096069869,"global_tag_id":3971,"id":24099,"modified":"165","project_id":1254,"project_tag_id":3993,"start_seconds":975.925487992371,"video_id":11503,"video_tag_id":20673,"youtube_id":"21","tag":"14","$$hashKey":"166"},"2019-04-24T10:10:04+00:00","Marijuana",[],{"created":"119","end_seconds":977.14847161572,"global_tag_id":3972,"id":24100,"modified":"167","project_id":1254,"project_tag_id":3994,"start_seconds":921.707423580786,"video_id":11503,"video_tag_id":20674,"youtube_id":"21","tag":"15","$$hashKey":"168"},{"created":"169","end_seconds":919.777292576419,"global_tag_id":3972,"id":24101,"modified":"169","project_id":1254,"project_tag_id":3994,"start_seconds":914.777292576419,"video_id":11503,"video_tag_id":20674,"youtube_id":"21","tag":"15","$$hashKey":"170"},"2019-04-24T10:11:24+00:00","Opioid Crisis",[],{"created":"171","end_seconds":686.082969432314,"global_tag_id":3974,"id":24110,"modified":"172","project_id":1254,"project_tag_id":3996,"start_seconds":681.622923961853,"video_id":11503,"video_tag_id":20678,"youtube_id":"21","tag":"16","$$hashKey":"173"},"2019-04-24T16:10:21+00:00",[],{"created":"174","end_seconds":1136.54148471616,"global_tag_id":3979,"id":24117,"modified":"175","project_id":1254,"project_tag_id":4001,"start_seconds":1111.65683496948,"video_id":11503,"video_tag_id":20683,"youtube_id":"21","tag":"17","$$hashKey":"176"},"2019-04-24T16:38:27+00:00","Voting Rights",[],[2376],[75,2376,2466,2468,2591],"2019-04-19T10:52:52+00:00",{"created":"177","id":1906,"is_admin":false,"is_assigned":true,"is_owner":false,"is_pending":false,"last_updates_viewed":"178","modified":"178"},"Test Channel for US 2020 Elections","//lh3.googleusercontent.com/UGBFADRJvGGgDq25ErSVrV24FYAd8uTKyNKErGPC-iiotvvIjJl1HruFW1V1cC7KpPrXJ7ee1G05hwYOLJjcYsdFtF8Nsw","2019-04-19T10:53:50+00:00","US2020",{"email":"83","first_name":"84","id":2376,"last_name":"86","profile_img_url":"87"},["179","180","181","182","183","184","185","186","187","188","189","190","191","192","193","194","195","196","197","198","199","200"],["25","201"],"2019-04-25T08:27:36+00:00","2019-04-25T08:27:37+00:00","We need transcript and translation here",{"email":"66","first_name":"67","id":2591,"last_name":"68","profile_img_url":"69"},"11.27am Apr 25th","2019-04-24T16:23:44+00:00","2019-04-24T16:24:51+00:00","object:253","2019-04-24T15:56:34+00:00","2019-04-24T15:56:54+00:00","object:264","2019-04-24T16:04:29+00:00","object:265","2019-04-24T16:15:49+00:00","2019-04-24T16:17:18+00:00","object:286","2019-04-24T10:15:35+00:00","object:297","2019-04-24T16:15:04+00:00","2019-04-24T16:15:13+00:00","object:308","2019-04-24T16:11:31+00:00","2019-04-24T16:14:55+00:00","object:319","2019-04-24T10:10:05+00:00","2019-04-24T16:23:00+00:00","object:330","2019-04-24T10:13:44+00:00","object:341","2019-04-24T10:14:05+00:00","object:342","2019-04-24T16:10:22+00:00","2019-04-24T16:10:39+00:00","object:363","2019-04-24T16:38:28+00:00","2019-04-24T16:38:40+00:00","object:374","2019-04-19T13:52:20+00:00","2019-04-24T15:03:13+00:00",{"id":3958,"name":"202","taginstance_count":0},{"id":3959,"name":"95","taginstance_count":3},{"id":3960,"name":"203","taginstance_count":1},{"id":3961,"name":"204","taginstance_count":1},{"id":3962,"name":"205","taginstance_count":1},{"id":3963,"name":"206","taginstance_count":1},{"id":3964,"name":"207","taginstance_count":1},{"id":3965,"name":"208","taginstance_count":1},{"id":3966,"name":"209","taginstance_count":1},{"id":3967,"name":"210","taginstance_count":1},{"id":3968,"name":"211","taginstance_count":1},{"id":3969,"name":"212","taginstance_count":1},{"id":3970,"name":"213","taginstance_count":1},{"id":3971,"name":"115","taginstance_count":1},{"id":3972,"name":"120","taginstance_count":2},{"id":3973,"name":"103","taginstance_count":1},{"id":3974,"name":"28","taginstance_count":1},{"id":3975,"name":"111","taginstance_count":1},{"id":3976,"name":"107","taginstance_count":1},{"id":3977,"name":"99","taginstance_count":1},{"id":3978,"name":"90","taginstance_count":1},{"id":3979,"name":"127","taginstance_count":1},{"archived_at":"214","channel_id":"215","channel_name":"216","created":"217","duplicate_count":0,"duration":5608,"favourited":false,"id":11498,"location_overridden":false,"missing_from_youtube":false,"modified":"218","name":"219","notes":"220","order":0,"precise_location":true,"pretty_created":"221","pretty_duration":"222","pretty_publish_date":"223","project_id":1254,"publish_date":"224","recorded_date_overridden":false,"tag_count":0,"watch_count":1,"watched":false,"youtube_id":"225","c_id":"226","c_thumbnail_url":"227","c_theatre_url":"228","project":"81"},"Obama Reference","Supreme Court Topic","Guns Topic (2nd Amendment)","Abortion Topic","Immigration Topic","Wikileaks Russia","Nuclear Weapons","Economy Topic","Fitness to be POTUS Topic","Foreign Policy Topic","National Debt Topic","The Wall","2019-04-19T10:58:51+00:00","UCqnbDFdCpuN8CMEg0VuEBqA","The New York Times","2019-04-19T10:56:46+00:00","2019-04-19T10:58:18+00:00","Second Presidential Debate | Election 2016 | The New York Times","Hillary Clinton and Donald J. Trump square off for the second time during a debate held at Washington University in St. Louis.\\n\\nSubscribe to the Times Video newsletter for free and get a handpicked selection of the best videos from The New York Times every week: http://bit.ly/timesvideonewsletter\\n\\nSubscribe on YouTube: http://bit.ly/U8Ys7n\\n\\nWatch more videos at: http://nytimes.com/video\\n\\n---------------------------------------------------------------\\n\\nWant more from The New York Times?\\n\\nTwitter: https://twitter.com/nytvideo\\n\\nInstagram: http://instagram.com/nytvideo\\n\\nFacebook: https://www.facebook.com/nytvideo\\n\\nGoogle+: https://plus.google.com/+nytimes\\n\\nWhether it's reporting on conflicts abroad and political divisions at home, or covering the latest style trends and scientific developments, New York Times video journalists provide a revealing and unforgettable view of the world. It's all the news that's fit to watch. On YouTube.\\n\\nSecond Presidential Debate | Election 2016 | The New York Times\\nhttp://www.youtube.com/user/TheNewYorkTimes","Apr 19, 2019","1:33:28","Oct 10, 2016","2016-10-10T02:56:26+00:00","rfq0Yw2sMq0","1254:rfq0Yw2sMq0","//i3.ytimg.com/vi/rfq0Yw2sMq0/default.jpg","/project/1254/video/rfq0Yw2sMq0"]
`;

export default Flatted.parse(DATA);

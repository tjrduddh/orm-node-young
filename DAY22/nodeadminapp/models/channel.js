module.exports = function (sequelize, DataTypes) {
	return sequelize.define(
		"channel",
		{
			channel_id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
				comment: "채널 고유번호",
			},
			community_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				comment: "커뮤니티 고유번호 (외래키)",
			},
			category_code: {
				type: DataTypes.INTEGER,
				allowNull: true,
				comment: "카테고리 코드",
			},
			channel_name: {
				type: DataTypes.STRING(100),
				allowNull: false,
				comment: "채널 이름",
			},
			user_limit: {
				type: DataTypes.INTEGER,
				allowNull: true,
				comment: "채널 사용자 제한",
			},
			channel_img_path: {
				type: DataTypes.STRING(200),
				allowNull: true,
				comment: "채널 이미지 경로",
			},
			channel_desc: {
				type: DataTypes.STRING(1000),
				allowNull: true,
				comment: "채널 설명",
			},
			channel_state_code: {
				type: DataTypes.TINYINT,
				allowNull: true,
				comment: "채널 상태 코드",
			},
			reg_date: {
				type: DataTypes.DATE,
				allowNull: true,
				comment: "등록 일자",
			},
			reg_member_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
				comment: "등록 회원 ID",
			},
			edit_date: {
				type: DataTypes.DATE,
				allowNull: true,
				comment: "수정 일자",
			},
			edit_member_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
				comment: "수정 회원 ID",
			},
		},
		{
			sequelize,
			tableName: "channel",
			timestamps: false,
			comment: "채널 정보",
			indexes: [
				{
					name: "PRIMARY",
					unique: true,
					using: "BTREE",
					fields: [{ name: "channel_id" }],
				},
				{
					name: "FK_community_id",
					using: "BTREE",
					fields: [{ name: "community_id" }],
				},
			],
		}
	);
};